import { BillBoard } from "@prisma/client";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { imageUrl: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Label Required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL Required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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

    //clerk returns userId if successful user sign
    //see more
    //https://clerk.com/docs/references/nextjs/authentication-object
    //https://clerk.com/docs/references/nextjs/auth Unauthorized

    if (!params.storeId) {
      return new NextResponse("Store ID required", { status: 400 });
    }
    const billboard = await prismadb.billBoard.create({
      data: {
        label: label,
        imageUrl: imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID required", { status: 400 });
    }

    const billboards = await prismadb.billBoard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    if (!billboards) {
      return new NextResponse("BillBoard Not Found", { status: 400 });
    }

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
