import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("billboardId Required", { status: 400 });
    }

    //check whether the user have access to billboard id or not
    const billboard = await prismadb.billBoard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[billBoard_get]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    //Check for user authentication
    const { userId } = auth();

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!label) {
      return new NextResponse("label Required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl Required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("billboard Id Required", { status: 400 });
    }

    const storeBuUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!storeBuUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billBoard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label: label,
        imageUrl: imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[billboard_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//DON'T REMOVE req params only available in the second function after req so need req:Request
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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

    if (!params.billboardId) {
      return new NextResponse("billboardId Required", { status: 400 });
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
    const billBoard = await prismadb.billBoard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[billBoard_delete]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
