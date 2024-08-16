import { useState } from "react";
import { Order } from "../../supabaseQueries";
import { OrderEditor } from "./OrderEditor";

interface UseOrderEditorProps {
  order?: Order;
  asDialog?: boolean;
}

export const useOrderEditor = ({
  order,
  asDialog,
}: UseOrderEditorProps = {}) => {
  const [open, setOpen] = useState(false);

  const orderEditor = (
    <OrderEditor
      open={open}
      setOpen={setOpen}
      order={order}
      asDialog={asDialog}
    />
  );

  return {
    orderEditor,
    open,
    setOpen,
  };
};
