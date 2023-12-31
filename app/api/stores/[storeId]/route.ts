import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    //Check for user authentication
    const { userId } = auth();

    const body = await req.json();

    const { name } = body;

    //Check user login or not
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    //Check for name enter or not
    if (!name) {
      return new NextResponse("Name Required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id Required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
      data: {
        name: name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//DON'T REMOVE req params only available in the second function after req so need req:Request
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    //Check for user authentication
    const { userId } = auth();

    //Check user login or not
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id Required", { status: 400 });
    }

    //DELETEMANY FOR USERID TO WORK
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("[DELETE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
