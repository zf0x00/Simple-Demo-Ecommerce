import React from "react";
import BillboardClients from "./components/billboard-clients";
import prismadb from "@/lib/prismadb";
import { BillBoardColumn } from "./components/columns";
import { format } from "date-fns";

async function BillBoardsPage({ params }: { params: { storeId: string } }) {
  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillBoardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Headings */}
        <BillboardClients data={formattedBillboards} />
      </div>
    </div>
  );
}

export default BillBoardsPage;
