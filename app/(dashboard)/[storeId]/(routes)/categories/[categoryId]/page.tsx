import prismadb from "@/lib/prismadb";
import React from "react";
import CategoryForm from "./components/CategoryForm";

export default async function Categoriespage({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboard = await prismadb.billBoard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm category={category} billboard={billboard} />
      </div>
    </div>
  );
}
