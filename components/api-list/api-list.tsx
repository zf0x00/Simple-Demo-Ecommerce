import React from "react";
import ApiAlert from "../api-alert/api-alert";
import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";

interface ApiListProps {
  entityName: string;
  entityId: string;
}

export default function ApiList({ entityName, entityId }: ApiListProps) {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title={"GET"}
        description={`${baseUrl}/${entityName}`}
        variant={"public"}
      />

      <ApiAlert
        title={"GET"}
        description={`${baseUrl}/${entityName}/{${entityName}}`}
        variant={"public"}
      />
      <ApiAlert
        title={"POST"}
        description={`${baseUrl}/${entityName}`}
        variant={"public"}
      />
      <ApiAlert
        title={"PATCH"}
        description={`${baseUrl}/${entityName}/{${entityName}}`}
        variant={"admin"}
      />
      <ApiAlert
        title={"DELETE"}
        description={`${baseUrl}/${entityName}/{${entityName}}`}
        variant={"admin"}
      />
    </>
  );
}
