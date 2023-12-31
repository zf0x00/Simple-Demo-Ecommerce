"use client";
import Heading from "@/components/heading/heading";
import { Button } from "@/components/ui/button";
import { Size } from "@prisma/client";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AlertModal from "@/components/alert-modal/alert-modal";
import ApiAlert from "@/components/api-alert/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image upload/image-upload";

interface SizeProps {
  sizes: Size | null;
}

//to validate input of the form
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeValues = z.infer<typeof formSchema>;

export default function SizeForm({ sizes }: SizeProps) {
  //its for the control alert modal cant use in zustand modal like moadal because it gonna
  //use diffrent api routes every single time work see 2:54 for more
  const [open, setOpen] = useState(false);

  //use for delete button alert
  const [loading, setLoading] = useState(false);

  //using this on hooks to solve the hydration error issue see 3.34 for more
  const window = useOrigin();

  const params = useParams();
  const router = useRouter();

  const title = sizes ? "Edit Size" : "Create Size";
  const description = sizes ? "Edit description" : "Create description";
  const toastMessage = sizes ? "Size updated" : "Size created";
  const action = sizes ? "Save Changes" : "Create";

  //form
  const form = useForm<SizeValues>({
    resolver: zodResolver(formSchema),
    defaultValues: sizes || {
      name: "",
      value: "",
    },
  });

  const OnSubmit = async (data: SizeValues) => {
    try {
      setLoading(true);
      if (sizes) {
        //must pass the same name as folder name
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      console.log(`${params.storeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const OnDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size Deleted");
    } catch (error) {
      toast.error("remove all categories using this Size");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => OnDelete()}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {sizes && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />

      {/* Setting Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(OnSubmit)}
          className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size Value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      {/* <ApiAlert
        title={"test"}
        description={`${window}/api/${params.storeId}`}
        variant={"public"}
      /> */}
    </>
  );
}
