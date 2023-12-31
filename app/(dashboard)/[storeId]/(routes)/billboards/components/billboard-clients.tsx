"use client";
import Heading from "@/components/heading/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillBoard } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BillBoardColumn, columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import ApiList from "@/components/api-list/api-list";
interface BillboardClientsProps {
  data: BillBoardColumn[];
}

export default function BillboardClients({ data }: BillboardClientsProps) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description={"Manage billboard for your store"}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} serachKey={"label"} />
      <Heading title="API List" description="API Call from Billboard" />
      <Separator />
      <ApiList entityName={"billboards"} entityId={"billboardId"} />
    </>
  );
}
