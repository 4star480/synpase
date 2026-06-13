import { revalidatePath } from "next/cache";

/** Bust cached order/payment views after checkout or payment updates. */
export function revalidateOrderViews() {
  revalidatePath("/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/payments");
}
