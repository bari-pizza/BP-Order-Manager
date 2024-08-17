import { supaClient } from "./supaClient";
import { Tables } from "./supabase";
import { z } from "zod";

export type Profile = Tables<"profiles">;
export type Drawer = Tables<"drawers">;
export type DrawerType = Tables<"drawers">["drawer_type"];
export type DriverDrawer = Drawer & { driver: Profile };
export type Order = Tables<"orders">;

type DirtyDriverDrawer = { drawer: Drawer; driver: Profile };

export const getAllDrawers = async () => {
  const { data, error } = await supaClient
    .from("drawers")
    .select("*")
    .neq("drawer_type", "driver");

  if (error) {
    console.error(error);
    return [] as Drawer[];
  }

  return data as unknown as Drawer[];
};

const convertToDriverDrawer = (
  dirtyDriverDrawer: DirtyDriverDrawer
): DriverDrawer => {
  return {
    ...dirtyDriverDrawer.drawer,
    driver: dirtyDriverDrawer.driver,
  };
};

export const getAllDrivers = async () => {
  const { data, error } = await supaClient
    .from("drawers.drivers")
    .select("drawer:drawers(*), driver:profiles(*)");

  if (error) {
    console.error(error);
    return [] as DriverDrawer[];
  }

  return data.map((d) =>
    convertToDriverDrawer(d as unknown as DirtyDriverDrawer)
  );
};

interface GetAllDaysOrdersProps {
  year: number;
  month: number;
  day: number;
}

const supabaseDate = z.object({
  year: z.number().min(2024).max(2100),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
});

export const getAllDaysOrders = async ({
  year,
  month,
  day,
}: GetAllDaysOrdersProps) => {
  console.log(`getting orders for ${month}/${day}/${year}`);
  try {
    supabaseDate.parse({ year, month, day });
  } catch (error) {
    console.error(error);
    return [] as Order[];
  }
  const { data, error } = await supaClient
    .from("orders")
    .select("*")
    .eq("business_date", `${year}-${month}-${day}`);

  if (error) {
    console.error(error);
    return [] as Order[];
  }

  return data as unknown as Order[];
};

interface DummyQueryFnProps<T> {
  timeout?: number;
  data?: T[];
}

export const dummyQueryFn = async <T>({
  timeout = 1000,
  data = [],
}: DummyQueryFnProps<T> = {}): Promise<T[]> => {
  console.log("calling dummyQueryFn with timeout", timeout, data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
      console.log("done calling dummyQueryFn with timeout", timeout);
    }, timeout);
  });
};

export const queryFnWrapper = <T>(
  fn: () => Promise<T>,
  timeout: number
): (() => Promise<T>) => {
  return async () => {
    const timeoutPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });

    const result = await Promise.all([fn(), timeoutPromise]);

    return result[0];
  };
};
