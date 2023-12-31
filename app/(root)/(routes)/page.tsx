"use client";

import Modal from "@/components/ui/modal";
import { useStoreModel } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function SetupPage() {
  //check for create store modal open using zustand
  const onOpen = useStoreModel((state) => state.onOpen);
  const isOpen = useStoreModel((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
