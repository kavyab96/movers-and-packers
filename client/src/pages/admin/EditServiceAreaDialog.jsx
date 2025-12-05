import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

const EditServiceAreaDialog = ({ area, open, onClose, onUpdate }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      city: "",
      postal_code: "",
      // latitude: "",
      // longitude: "",
    },
  });

  // Load values when dialog opens
  useEffect(() => {
    if (area) {
      form.reset({
        name: area.name || "",
        city: area.city || "",
        postal_code: area.postal_code?.join(", ") || "",
        // latitude: area.latitude?.toString() || "",
        // longitude: area.longitude?.toString() || "",
      });
    }
  }, [area, form]);

  const state = area?.state || "Kerala";
  const country = area?.country || "India";

  const onSubmit = (data) => {
    const updated = {
      name: data.name,
      city: data.city,
      state,
      country,
      postal_code: data.postal_code
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== ""),

      // convert to Number
      // latitude: data.latitude ? Number(data.latitude) : null,
      // longitude: data.longitude ? Number(data.longitude) : null,
    };

    if (onUpdate) onUpdate(area._id, updated);
    // onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Service Area
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

              {/* STATE */}
              <div className="flex flex-col gap-2">
                <FormLabel>State</FormLabel>
                <Input disabled value={state} className="bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>

              {/* COUNTRY */}
              <div className="flex flex-col gap-2">
                <FormLabel>Country</FormLabel>
                <Input disabled value={country} className="bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>


              {/* AREA NAME */}
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Area name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Area Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Area name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CITY */}
              <FormField
                control={form.control}
                name="city"
                rules={{
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* POSTAL CODES */}
              <FormField
                control={form.control}
                name="postal_code"
                rules={{
                  required: "Postal code is required",
                  pattern: {
                    value: /^[0-9,\s]+$/,
                    message: "Only numbers, commas and spaces allowed (e.g., 686631, 686632)",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Codes</FormLabel>
                    <FormControl>
                      <Input placeholder="Eg: 686631, 686632" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceAreaDialog;
