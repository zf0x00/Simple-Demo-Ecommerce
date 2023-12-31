"use client";
import Heading from "@/components/heading/heading";
import { Button } from "@/components/ui/button";
import { Colors, Size } from "@prisma/client";
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

interface ColorsProps {
  colors: Colors | null;
}

//to validate input of the form
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "String must be valid hex Code",
  }),
});

type ColorValues = z.infer<typeof formSchema>;

export default function ColorsForm({ colors }: ColorsProps) {
  //its for the control alert modal cant use in zustand modal like moadal because it gonna
  //use diffrent api routes every single time work see 2:54 for more
  const [open, setOpen] = useState(false);

  //use for delete button alert
  const [loading, setLoading] = useState(false);

  //using this on hooks to solve the hydration error issue see 3.34 for more
  const window = useOrigin();

  const params = useParams();
  const router = useRouter();

  const title = colors ? "Edit Color" : "Create Color";
  const description = colors ? "Edit description" : "Create description";
  const toastMessage = colors ? "Color updated" : "Color created";
  const action = colors ? "Save Changes" : "Create";

  //form
  const form = useForm<ColorValues>({
    resolver: zodResolver(formSchema),
    defaultValues: colors || {
      name: "",
      value: "",
    },
  });

  const OnSubmit = async (data: ColorValues) => {
    try {
      console.log(`OnSubmit Color ${data}`);

      setLoading(true);
      if (colors) {
        console.log(`OnSubmit Product onside if ${data}`);

        //must pass the same name as folder name
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      console.log(`${params.storeId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      console.log(`OnSubmit Color Id${params.colorId}`);

      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Size Deleted");
    } catch (error) {
      toast.error("remove all categories using this colors");
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
        {colors && (
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
                      placeholder="Color Name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color Value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
