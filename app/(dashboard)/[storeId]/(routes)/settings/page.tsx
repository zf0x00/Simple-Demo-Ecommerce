import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import SettingsForm from "./components/SettingsForm";

interface SettingPageProps {
  params: {
    storeId: string;
  };
}

export default async function SettingsPage({ params }: SettingPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // create request to network to find settings for this store
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm store={store} />
      </div>
    </div>
  );
}
