"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

//HTMLAttributes says it only passes html content
export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  //use to check the url path name see more in docs
  const pathname = usePathname();

  //use to get params because this element in layout.tsx so it can access params
  const params = useParams();

  const routes = [
    {
      link: `/${params.storeId}`,
      label: "OverView",
      path: pathname === `/${params.storeId}`,
    },
    {
      link: `/${params.storeId}/billboards`,
      label: "Billboards",
      path: pathname === `/${params.storeId}/billboards`,
    },
    {
      link: `/${params.storeId}/categories`,
      label: "Categories",
      path: pathname === `/${params.storeId}/categories`,
    },
    {
      link: `/${params.storeId}/sizes`,
      label: "Sizes",
      path: pathname === `/${params.storeId}/sizes`,
    },
    {
      link: `/${params.storeId}/colors`,
      label: "Colors",
      path: pathname === `/${params.storeId}/colors`,
    },
    {
      link: `/${params.storeId}/products`,
      label: "Products",
      path: pathname === `/${params.storeId}/products`,
    },
    {
      link: `/${params.storeId}/orders`,
      label: "Orders",
      path: pathname === `/${params.storeId}/orders`,
    },
    {
      link: `/${params.storeId}/settings`,
      label: "Settings",
      path: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.label}
          href={route.link}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.path ? "text-black dark:text-white" : "text-muted-foreground"
          )}>
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
