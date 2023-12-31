import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!name) {
      return new NextResponse("name Required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("value Required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    console.log(`Size Route ${storeByUserId}`);
    console.log(`Size Route Params Store ID ${params.storeId}`);

    if (!storeByUserId) {
      return new NextResponse("Unauthorized Size Route", { status: 403 });
    }

    //clerk returns userId if successful user sign
    //see more
    //https://clerk.com/docs/references/nextjs/authentication-object
    //https://clerk.com/docs/references/nextjs/auth Unauthorized

    if (!params.storeId) {
      return new NextResponse("Store ID required", { status: 400 });
    }
    const sizes = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[sizes_POST]", error);
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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    if (!sizes) {
      return new NextResponse("sizes Not Found", { status: 400 });
    }

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[sizes_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
