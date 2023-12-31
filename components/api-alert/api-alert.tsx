import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

// See more on utilitty type on QA typesript notion no 2
//https://www.typescriptlang.org/docs/handbook/utility-types.html
const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export default function ApiAlert({
  title,
  description,
  variant = "public",
}: ApiAlertProps) {
  // icon click and copy
  const OnCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route Copied");
  };

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <code className=" relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant={"outline"} size={"icon"} onClick={OnCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
