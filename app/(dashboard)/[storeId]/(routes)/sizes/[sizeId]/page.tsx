import prismadb from "@/lib/prismadb";
import React from "react";
import SizeForm from "./components/Size-Form";

export default async function Sizepage({
  params,
}: {
  params: { sizeId: string };
}) {
  const sizes = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm sizes={sizes} />
      </div>
    </div>
  );
}
