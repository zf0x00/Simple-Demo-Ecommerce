"use client";
import Heading from "@/components/heading/heading";
import { Button } from "@/components/ui/button";
import { Store } from "@prisma/client";
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

interface SettingFormProps {
  store: Store;
}

//to validate input of the form
const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({ store }: SettingFormProps) {
  //its for the control alert modal cant use in zustand modal like moadal because it gonna
  //use diffrent api routes every single time work see 2:54 for more
  const [open, setOpen] = useState(false);

  //use for delete button alert
  const [loading, setLoading] = useState(false);

  //using this on hooks to solve the hydration error issue see 3.34 for more
  const window = useOrigin();

  const params = useParams();
  const router = useRouter();

  //form
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: store,
  });

  const OnSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      //must pass the same name as folder name
      await axios.patch(`/api/stores/${params.storeId}`, data);
      console.log(`${params.storeId}`);
      router.refresh();
      toast.success("Store Updated");
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const OnDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store Deleted");
    } catch (error) {
      toast.error("remove all product first");
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
        <Heading title="Settings" description="Manage Store Preference" />
        <Button
          variant="destructive"
          size="icon"
          disabled={loading}
          onClick={() => setOpen(true)}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
      <Separator />

      {/* Setting Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(OnSubmit)}
          className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title={"test"}
        description={`${window}/api/${params.storeId}`}
        variant={"public"}
      />
    </>
  );
}
