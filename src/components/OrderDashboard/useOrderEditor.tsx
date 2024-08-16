import { useState } from "react";
import { Order } from "../../supabaseQueries";
import { OrderEditor } from "./OrderEditor";

interface UseOrderEditorProps {
  order?: Order;
}

export const useOrderEditor = ({ order }: UseOrderEditorProps = {}) => {
  const [open, setOpen] = useState(false);

  const orderEditor = (
    <OrderEditor open={open} setOpen={setOpen} order={order} />
  );

  return {
    orderEditor,
    open,
    setOpen,
  };
};
