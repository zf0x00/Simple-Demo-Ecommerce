"use client";
import Heading from "@/components/heading/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { OrdersColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
interface OrdersClientsProps {
  data: OrdersColumn[];
}

export default function OrdersClients({ data }: OrdersClientsProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description={"Manage Orders for your store"}
      />
      <Separator />
      <DataTable columns={columns} data={data} serachKey={"products"} />
    </>
  );
}
