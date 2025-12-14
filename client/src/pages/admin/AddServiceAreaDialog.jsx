import { useEffect } from "react";
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

const AddServiceAreaDialog = ({ open, onClose, onCreate }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      city: "",
      postal_code: "",
      // latitude: "",
      // longitude: "",
    },
  });

  const state = "Kerala";
  const country = "India";

  const onSubmit = (data) => {
    const newArea = {
      name: data.name,
      city: data.city,
      state,
      country,
      postal_code: data.postal_code
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== ""),

      // Convert from string → number
      // latitude: data.lat ? Number(data.latitude) : null,
      // longitude: data.lng ? Number(data.longitude) : null,
    };




    onCreate(newArea);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add New Service Area
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

              {/* State */}
              <div className="flex flex-col gap-2">
                <FormLabel>State</FormLabel>
                <Input disabled value={state} className="bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>

              {/* Country */}
              <div className="flex flex-col gap-2">
                <FormLabel>Country</FormLabel>
                <Input disabled value={country} className="bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>

              {/* Area Name */}
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Area name is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters & spaces allowed",
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

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                rules={{
                  required: "City is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters & spaces allowed",
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

              {/* Postal Code */}
              <FormField
                control={form.control}
                name="postal_code"
                rules={{
                  required: "Postal code is required",
                  pattern: {
                    value: /^[0-9,\s]+$/,
                    message: "Only numbers, commas & spaces allowed",
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


              {/* Latitude */}
              {/* <FormField
                control={form.control}
                name="latitude"
                rules={{
                  required: "Latitude is required",
                  pattern: {
                    value: /^-?\d+(\.\d+)?$/,
                    message: "Enter a valid number",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10.0159" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Longitude */}
              {/* <FormField
                control={form.control}
                name="longitude"
                rules={{
                  required: "Longitude is required",
                  pattern: {
                    value: /^-?\d+(\.\d+)?$/,
                    message: "Enter a valid number",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 76.3419" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">Add Area</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceAreaDialog;
