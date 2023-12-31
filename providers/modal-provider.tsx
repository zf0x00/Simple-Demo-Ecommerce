"use client";

import StoreModal from "@/components/ui/modals/store-modal";
import React, { useEffect, useState } from "react";

export default function ModalProvider() {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
}
