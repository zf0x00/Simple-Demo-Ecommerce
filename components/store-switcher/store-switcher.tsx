"use client";
import { Store } from "@prisma/client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useStoreModel } from "@/hooks/use-store-modal";
import { redirect, useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Check,
  ChevronsUpDownIcon,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";

//TODO LEARN
type PopOverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

//we passing custom props need to learn this
interface StoreSwitcherProps extends PopOverTriggerProps {
  items: Store[];
}

function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  //Modal store to see popover state
  const storeModel = useStoreModel();
  const params = useParams();
  const router = useRouter();

  //formatting items from the props
  const formattedItem = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  //check the current store id is the same as passed params
  const currentStore = formattedItem.find(
    (item) => item.value === params.storeId
  );

  console.log(`logs ${currentStore}`);

  //to check for combobox is open or close
  const [open, setOpen] = useState(false);

  //to redirect to the selected store
  const onStoresSelected = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Store"
          className={cn("w-[200px] justify-between", className)}>
          <StoreIcon className="w-4 h-4 mr-2" />
          {currentStore?.label}
          <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search Store..." />
            <CommandEmpty>No Store Found.</CommandEmpty>
            <CommandGroup heading="Store">
              {formattedItem.map((store) => (
                <CommandItem
                  key={store.label}
                  onSelect={() => onStoresSelected(store)}
                  className="text-sm">
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModel.onOpen();
                }}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default StoreSwitcher;
