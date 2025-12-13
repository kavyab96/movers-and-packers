import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { formatLabel, formatDate } from "@/utils/format";
import { X } from "lucide-react";

const allowedStatuses = ["accepted", "cancelled", "in-progress", "completed", "pending"];
const allowedTracking = ["en-route", "arrived", "loading", "moving", "unloading", "completed"];

const EditJobDialog = ({ job, open, onClose, onUpdate }) => {



  const [status, setStatus] = useState(job?.status || "");
  const [tracking, setTracking] = useState(job?.tracking_status || "");

  useEffect(() => {
    if (job) {
      setStatus(job.status || "");
      setTracking(job.tracking_status || "");  // null → ""
    }
  }, [job]);

  const handleSubmit = () => {
    const updated = {
      status,
      tracking_status: tracking
    };
    // API CALL TO UPDATE
    onUpdate(job._id, updated);
    // toast.success("Job updated successfully");
    // onClose();
  };

  return (
    // <Dialog open={open} onOpenChange={onClose}>
    //   <DialogContent className="max-w-lg">

    //     <DialogHeader>
    //       <DialogTitle className="flex gap-3">
    //         <span>Edit Job – </span>
    //         <span className="">{job?.booking_id}</span>
    //       </DialogTitle>


    //       {/*Additional read-only info */}
    //       <div className="mt-1 text-muted-foreground text-sm space-y-1">
    //         <p>Client: {job?.client_id?.name}</p>
    //         <p>Service Type: {formatLabel(job?.service_type)}</p>
    //       </div>

    //     </DialogHeader>

    //     <div className="space-y-6">

    //       {/* Status */}
    //       <div className="space-y-2">
    //         <p className="text-sm font-medium">Job Status</p>
    //         <Select
    //           value={status}
    //           onValueChange={(v) => setStatus(v)}
    //         >
    //           <SelectTrigger>
    //             <SelectValue placeholder="Select status" />
    //           </SelectTrigger>
    //           <SelectContent position="popper">
    //             {allowedStatuses.map((s) => (
    //               <SelectItem key={s} value={s}>
    //                 {formatLabel(s)}
    //               </SelectItem>
    //             ))}
    //           </SelectContent>
    //         </Select>
    //       </div>

    //       {/* Tracking Status */}
    //       <div className="space-y-2">
    //         <p className="text-sm font-medium">Tracking Status</p>
    //         <Select
    //           value={tracking}
    //           onValueChange={(v) => setTracking(v)}
    //         >
    //           <SelectTrigger>
    //             <SelectValue placeholder="Select tracking status" />
    //           </SelectTrigger>
    //           <SelectContent position="popper">
    //             {allowedTracking.map((s) => (
    //               <SelectItem key={s} value={s}>
    //                 {formatLabel(s)}
    //               </SelectItem>
    //             ))}
    //           </SelectContent>
    //         </Select>
    //             {/* X button to clear tracking */}
    //           {tracking && (
    //             <button
    //               onClick={() => setTracking("")}
    //               className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
    //             >
    //               <X size={16} />
    //             </button>
    //           )}


    //       </div>

    //     </div>

    //     <DialogFooter>
    //       <Button variant="outline" onClick={onClose}>Cancel</Button>
    //       <Button onClick={handleSubmit}>Save Changes</Button>
    //     </DialogFooter>

    //   </DialogContent>
    // </Dialog>



    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">

        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Job – {job?.booking_id}
          </DialogTitle>

          {/* Read-only info */}
          <div className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground space-y-1">
            <p><span className="font-medium text-foreground">Client  :</span> {job?.client_id?.name}</p>
            <p><span className="font-medium text-foreground">Service :</span> {formatLabel(job?.service_type)}</p>
            <p><span className="font-medium text-foreground">Requested Date :</span> {formatDate(job?.requested_date_time)}</p>
            <p><span className="font-medium text-foreground">Pickup :</span> {formatLabel(job?.pickup_location.name)}</p>
            {job.service_type !== 'packing' &&
              <p><span className="font-medium text-foreground">Drop-off :</span> {formatLabel(job?.dropoff_location.name)}</p>
            }
          </div>
        </DialogHeader>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6  w-full ">

          {/* Job Status */}
          <div className="space-y-1  ">
            <label className="text-sm font-medium">Job Status</label>
            <Select value={status} onValueChange={setStatus} >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {allowedStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {formatLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tracking Status */}
          <div className="space-y-1 ">
            <label className="text-sm font-medium">Tracking Status</label>

            <div className="relative ">

              <Select value={tracking} onValueChange={setTracking}>
                <SelectTrigger className="w-full pr-10">
                  {/* Extra padding to make room for X */}
                  <SelectValue placeholder="Tracking status" />
                </SelectTrigger>

                <SelectContent>
                  {allowedTracking.map((s) => (
                    <SelectItem key={s} value={s}>
                      {formatLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* X button INSIDE select input */}
              {tracking && (
                <button
                  type="button"
                  onClick={() => setTracking("")}
                  className="absolute left-25 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                >
                  <X size={16} />
                </button>
              )}

            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
