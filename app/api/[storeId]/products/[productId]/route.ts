import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("productId Required", { status: 400 });
    }

    //check whether the user have access to billboard id or not
    const product = await prismadb.products.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        images: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_get]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    //Check for user authentication
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      images,
      price,
      colorId,
      sizeId,
      isArchived,
      isFeatured,
      description,
      categoryId,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 400 });
    }

    if (!name) {
      return new NextResponse("name Required", { status: 400 });
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
    if (!description) {
      return new NextResponse("description Required", { status: 400 });
    }
    if (!params.productId) {
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

    await prismadb.products.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        description,
        categoryId,
        storeId: params.storeId,
        images: {
          deleteMany: {},
        },
      },
    });

    const products = await prismadb.products.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[products_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//DON'T REMOVE req params only available in the second function after req so need req:Request
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    if (!params.productId) {
      return new NextResponse("productId Required", { status: 400 });
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
    const product = await prismadb.products.deleteMany({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_delete]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
