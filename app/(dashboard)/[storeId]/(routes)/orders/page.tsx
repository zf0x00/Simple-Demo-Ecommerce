import React from "react";
import prismadb from "@/lib/prismadb";
import { OrdersColumn } from "./components/columns";
import { format } from "date-fns";
import OrdersClients from "./components/order-clients";
import { formatter } from "@/lib/utils";

async function OrdersPage({ params }: { params: { storeId: string } }) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          products: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrdersColumn[] = orders.map((item) => ({
    id: item.id,
    address: item.address,
    phone: item.phoneNumber,
    products: item.orderItems
      .map((orderItem) => orderItem.products?.name)
      .join(","),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.products?.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Headings */}
        <OrdersClients data={formattedOrders} />
      </div>
    </div>
  );
}

export default OrdersPage;
