import React from "react";
import BillboardClients from "./components/color-clients";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import SizesClients from "./components/color-clients";
import { ColorsColumn } from "./components/columns";
import ColorsClients from "./components/color-clients";

async function ColorsPage({ params }: { params: { storeId: string } }) {
  const sizes = await prismadb.colors.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColor: ColorsColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Headings */}
        <ColorsClients data={formattedColor} />
      </div>
    </div>
  );
}

export default ColorsPage;
