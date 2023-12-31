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
    const {
      name,
      description,
      images,
      price,
      colorId,
      sizeId,
      isArchived,
      isFeatured,
      categoryId,
    } = body;

    if (!name) {
      return new NextResponse("name Required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("description Required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("images URL Required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("price URL Required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("color URL Required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("size URL Required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("category URL Required", { status: 400 });
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
    const products = await prismadb.products.create({
      data: {
        name,
        description,
        price,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        categoryId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[products_POST]", error);
    return new NextResponse("Internal error Products", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store ID required", { status: 400 });
    }

    const products = await prismadb.products.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!products) {
      return new NextResponse("products Not Found", { status: 400 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.log("[products_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
