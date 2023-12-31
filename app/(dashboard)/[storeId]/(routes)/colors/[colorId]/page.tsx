import prismadb from "@/lib/prismadb";
import React from "react";
import SizeForm from "./components/Colors-Form";

export default async function Colorspage({
  params,
}: {
  params: { colorId: string };
}) {
  console.log(`colorId Page Id${params.colorId}`);

  const colors = await prismadb.colors.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm colors={colors} />
      </div>
    </div>
  );
}
