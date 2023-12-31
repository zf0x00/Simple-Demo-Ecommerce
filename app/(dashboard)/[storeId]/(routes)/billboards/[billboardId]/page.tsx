import prismadb from "@/lib/prismadb";
import React from "react";
import BillBoardForm from "./components/BillboardForm";

export default async function BillBoardpage({
  params,
}: {
  params: { billboardId: string };
}) {
  const billboard = await prismadb.billBoard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardForm billboards={billboard} />
      </div>
    </div>
  );
}
