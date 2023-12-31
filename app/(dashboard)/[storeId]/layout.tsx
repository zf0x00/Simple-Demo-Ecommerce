import Navbar from "@/components/navbar/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  //Check for user is authenticated using clerk
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  //check for store id in prismadb
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  // if no store id found redirect it to the homepage
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
