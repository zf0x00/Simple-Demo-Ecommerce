"use client";
import Heading from "@/components/heading/heading";
import { Button } from "@/components/ui/button";
import { BillBoard, Category } from "@prisma/client";
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
import { useOrigin } from "@/hooks/use-origin";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFormProps {
  category: Category | null;
  billboard: BillBoard[];
}

//to validate input of the form
const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

type CategoryValues = z.infer<typeof formSchema>;

export default function CategoryForm({
  category,
  billboard,
}: CategoryFormProps) {
  //its for the control alert modal cant use in zustand modal like moadal because it gonna
  //use diffrent api routes every single time work see 2:54 for more
  const [open, setOpen] = useState(false);

  //use for delete button alert
  const [loading, setLoading] = useState(false);

  //using this on hooks to solve the hydration error issue see 3.34 for more
  const window = useOrigin();

  const params = useParams();
  const router = useRouter();

  const title = category ? "Edit Category" : "Create Category";
  const description = category ? "Edit description" : "Create description";
  const toastMessage = category ? "Category updated" : "Category created";
  const action = category ? "Save Changes" : "Create";

  //form
  const form = useForm<CategoryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: "",
      billboardId: "",
    },
  });

  const OnSubmit = async (data: CategoryValues) => {
    try {
      setLoading(true);
      if (category) {
        //must pass the same name as folder name
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      console.log(`${params.storeId}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category Deleted");
    } catch (error) {
      toast.error(
        "Make Sure you remove all products using this category first"
      );
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
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BillBoard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboard.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
    </>
  );
}
