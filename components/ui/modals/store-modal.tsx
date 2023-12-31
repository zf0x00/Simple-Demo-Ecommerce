"use client";

import React, { useState } from "react";
import Modal from "../modal";
import { useStoreModel } from "@/hooks/use-store-modal";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Button } from "../button";
import axios from "axios";
import { toast } from "react-hot-toast";

//check for name schema
const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 character",
    })
    .max(20, {
      message: "Name must be below 20 character",
    }),
});

export default function StoreModal() {
  //zustand hooks
  const storeModal = useStoreModel();

  // to set button, form loading state
  const [loading, setloading] = useState(false);

  //use react hookform
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setloading(true);
      //send response to api
      const response = await axios.post("/api/stores", values);
      //if using redirect is create issue so we use this its 100% ready
      //after we redirect it to store.id page
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error("Something Wrong");
    } finally {
      setloading(false);
    }
  };

  // Return a modal on created modal on modal.tsx ans passing the children
  return (
    <Modal
      title={"Store"}
      description={"Add new store to manage"}
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}>
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter Your Shop Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2 space-x-2 flex items-center justify-end w-full">
                <Button
                  variant={"outline"}
                  onClick={storeModal.onClose}
                  disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Confirm
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
