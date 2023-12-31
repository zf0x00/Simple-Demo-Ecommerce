import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("sizeId Required", { status: 400 });
    }

    //check whether the user have access to category id or not
    const sizes = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[size_get]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    //Check for user authentication
    const { userId } = auth();

    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("name Required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("value Required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("size Id Required", { status: 400 });
    }

    //check whether the use have access to the billboard or store or not so he cannot
    //chnage the other stores
    const storeBuUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!storeBuUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const sizes = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name: name,
        value: value,
      },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[sizes_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//DON'T REMOVE req params only available in the second function after req so need req:Request
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    if (!params.sizeId) {
      return new NextResponse("categoryId Required", { status: 400 });
    }

    //check whether the user have access to billboard id or not
    const storeBuUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!storeBuUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    //DELETEMANY FOR USERID TO WORK
    const sizes = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[sizes_delete]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
