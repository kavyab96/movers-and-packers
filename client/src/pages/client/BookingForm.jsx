import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useSelector } from "react-redux";


import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { createBookingService } from "../../services/bookingServices";
import FullPageLoader from "../../components/loaders/FullPageLoader";

const BookingForm = ({ provider, areas, onClose }) => {
  const userData = useSelector((state) => state.user.user)
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      client_id: userData._id,
      provider_id: provider._id,
      service_type: "",
      pickup_location: "",
      dropoff_location: "",
      area_in_square_feet: "",
      requested_date_time: "",
      notes: "",

    }
  });


  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const bookingData = { ...values };

      //API call
      await createBookingService(bookingData);
      form.reset();    // Clear all form fields
      onClose();       // Close dialog
      toast.success("Booking created!");
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error(err.response.data.error || "Booking failed");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading && <FullPageLoader />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <DialogHeader>
            <DialogTitle className="capitalize">Book {provider.name}</DialogTitle>
            <DialogDescription>
              {/* Confirm your service details before booking. */}
            </DialogDescription>
          </DialogHeader>


          <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-6 ">
            {/* 1 Preferred date */}
            <FormField
              control={form.control}
              name="requested_date_time"
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Preferred Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={` pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""
                            }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2 service type */}
            <FormField
              control={form.control}
              name="service_type"
              rules={{ required: "Service Type is required" }}
              render={({ field }) => (
                <FormItem className="w-ful">
                  <FormLabel>Service Type</FormLabel>
                  <FormControl >
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moving">Moving</SelectItem>
                        <SelectItem value="packing">Packing</SelectItem>
                        <SelectItem value="both">Moving & Packing</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 3 pickup */}
            <FormField
              control={form.control}
              name="pickup_location"
              rules={{ required: "Pickup location is required" }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pickup Location</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      {/* defaultValue={field.value} */}
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Select pickup location" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          areas.map(area => (
                            <SelectItem key={area._id} value={area._id}>{area.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* 4. Dropoff Location */}
            <FormField
              control={form.control}
              name="dropoff_location"
              rules={{ required: "Drop-off location is required" }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Drop-off Location</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Select drop-off location" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map(area => (
                          <SelectItem key={area._id} value={area._id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 5 area of sqrft */}
            <FormField
              control={form.control}
              name="area_in_square_feet"
              rules={{ required: "Area is required" }}
              render={({ field }) => (
                <FormItem className="w-full h-11">
                  <FormLabel>Area (in square feet)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1200" {...field} className=" h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 6. notes  */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mention floors, fragile items, timing preference, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>



          <DialogFooter>
            <Button disabled={loading} type="submit" className="w-full">
              Confirm Booking
            </Button>
          </DialogFooter>

        </form>
      </Form>







    </div>
  );
};

export default BookingForm;
