import { Category } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("categoryId Required", { status: 400 });
    }

    //check whether the user have access to category id or not
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[category_get]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    //Check for user authentication
    const { userId } = auth();

    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("name Required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("billboardId Required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("category Id Required", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name: name,
        billboardId: billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[category_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//DON'T REMOVE req params only available in the second function after req so need req:Request
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
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

    if (!params.categoryId) {
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
    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("[category_delete]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
