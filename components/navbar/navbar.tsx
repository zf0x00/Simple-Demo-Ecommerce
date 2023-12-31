import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import MainNav from "./main-nav";
import StoreSwitcher from "../store-switcher/store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="flex border-b h-16 items-center px-4">
      <StoreSwitcher items={store} />
      <MainNav className="mx-6" />
      <div className="ml-auto space-x-4 flex items-center">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
