import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";



import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Pencil, SearchX } from "lucide-react";
import { getPaymentsService } from "../../services/providerServices"; // your API service

import FullPageLoader from "../../components/loaders/FullPageLoader";
import DataTablePagination from "../../components/table/DataTablePagination";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// import EditJobDialog from "../provider/EditJobDialog"
import { formatDate } from "../../utils/format";
import EarningsFilter from "../../components/filters/EarningsFilter";
import EmptyState from "@/pages/shared/EmptyState.jsx";

const Earnings = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [total, setTotal] = useState(2);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    date: null,
  });

  const [totalEarnings, setTotalEarnings] = useState(0);




  //edit dialog-------------
  // const [selectedJob, setSelectedJob] = useState(null);
  // const [editOpen, setEditOpen] = useState(false);

  // const handleJobUpdate = async (jobId, updatedData) => {
  //     try {
  //         // API call
  //         await updateJobService(jobId, updatedData)
  //         toast.success("Job updated successfully");

  //         // Update UI with real backend data
  //         setJobs(prev =>
  //             prev.map(j => (j._id === jobId ? updatedData : j))
  //         );

  //         // Close dialog
  //         // setEditOpen(false);

  //         // Refetch the fresh page from server
  //         fetchPayments(currentPage, itemsPerPage);

  //     } catch (error) {
  //         if (error.response?.status === 400) {
  //             toast.error(error.response.data.error || "Updation failed");
  //         } else {
  //             toast.error("Something went wrong. Please try again.");
  //         }

  //     }

  // };

  //edit dialog-------------



  // Fetch payments
  useEffect(() => {
    fetchPayments(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, filters]);


  const fetchPayments = async (page = 1, limit = itemsPerPage) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit,
        date: filters.date ? filters.date.toISOString() : undefined,
      }
      const res = await getPaymentsService(params);
      const result = res.data;
      setPayments(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.currentPage || 1);
      setTotal(result.total || 0);
      setTotalEarnings(result.totalEarnings || 0);
    } catch (error) {
      console.log("Failed to load payments", error);
    } finally {
      setLoading(false);
    }
  };





  const hasActiveFilters =
    filters.date !== null;
  //||
  // filters.requestedDate !== "all" ||
  // filters.serviceType !== "all" ||
  // filters.jobStatus !== "all";

  const handleClearFilters = () => {
    setFilters({ date: null });
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {loading && <FullPageLoader />}


      <h1 className="text-2xl font-bold">Earnings</h1>
      <div className="flex flex-wrap justify-between md:items-center">
        <div className="flex gap-7">
          <p className="text-lg font-medium">Total : {total} </p>
          <p className="text-lg font-medium">Total Earnings : ₹{totalEarnings} </p>
        </div>


        <EarningsFilter
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1); // reset pagination
          }}
          onClear={() => {
            setFilters({
              createdDate: "all",
            });
            setCurrentPage(1);
          }}
        />
      </div>


      <Card className="p-4">
        {/* Table Header */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Created Date</TableHead>


            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-14" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>
                  <EmptyState
                    icon={SearchX}
                    title="No payments found"
                    description={
                      hasActiveFilters
                        ? "No payments match the selected filters."
                        : "Payments assigned to you will appear here."
                    }
                    actionLabel={hasActiveFilters ? "Clear filters" : null}
                    onAction={hasActiveFilters ? handleClearFilters : null}
                  />
                </TableCell>
              </TableRow>
            ) : (
              payments.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">{job.service_request_id?.booking_id}</TableCell>
                  <TableCell>{job.paid_by?.name}</TableCell>
                  <TableCell>{job.payment_status}</TableCell>
                  <TableCell>{job.amount}</TableCell>
                  <TableCell>{formatDate(job.created_at)}</TableCell>

                  {/* <TableCell>
                    <Badge
                      variant={
                        job.status === "completed"
                          ? "success"
                          : job.status === "in-progress"
                            ? "default"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {job.status}
                    </Badge>
                  </TableCell> */}

                  {/* <TableCell>
                    {job.payment_status ? (
                      <Badge
                        variant={
                          job.payment_status === "completed"
                            ? "success"
                            : job.payment_status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="capitalize"
                      >
                        {job.payment.payment_status} — ₹{job.payment.amount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">No Payment</span>
                    )}
                  </TableCell> */}
                  {/* <TableCell>{formatDate(job.requested_date_time)}</TableCell>
                  <TableCell>{formatDate(job.created_at)}</TableCell> */}


                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>



      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />


      {/* edit dialog component */}
      {/* {selectedJob && (
                <EditJobDialog
                    job={selectedJob}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onUpdate={handleJobUpdate}
                />
            )} */}


    </div>
  );
};




export default Earnings;
