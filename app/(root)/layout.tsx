import { auth } from "@clerk/nextjs";
import React from "react";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

async function SetupLayout({ children }: { children: React.ReactNode }) {
  // check for user whether is authenticated or not
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  console.log(`User id ${userId}`);

  //check whether already store existed in db if it in redirect to store id page
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  console.log(`Store id ${store?.id}`);

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}

export default SetupLayout;
