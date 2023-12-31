"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrdersColumn = {
  id: string;
  phone: string;
  address: string;
  totalPrice: string;
  products: string;
  createdAt: string;
  isPaid: boolean;
};

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "TotalPrice",
  },
  {
    accessorKey: "isPaid",
    header: "IsPaid",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
