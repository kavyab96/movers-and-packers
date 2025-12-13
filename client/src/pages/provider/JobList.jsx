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
import { Eye, Pencil,SearchX } from "lucide-react";
import { getAllJobsService, updateJobService } from "../../services/providerServices"; // your API service

import FullPageLoader from "../../components/loaders/FullPageLoader";
import DataTablePagination from "../../components/table/DataTablePagination";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import EditJobDialog from "../provider/EditJobDialog"
import { formatDate } from "../../utils/format";
import JobFilters from "../../components/filters/JobFilters";
import EmptyState from "@/pages/shared/EmptyState.jsx";

const JobList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        createdDate: "all",        // all | week | month
        requestedDate: "all",      // all | week | month
        serviceType: "all",        // all | moving | packing
        jobStatus: "all",      // all | pending | completed
    });



    //edit dialog-------------
    const [selectedJob, setSelectedJob] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const handleJobUpdate = async (jobId, updatedData) => {
        try {
            // API call
            await updateJobService(jobId, updatedData)
            toast.success("Job updated successfully");

            // Update UI with real backend data
            setJobs(prev =>
                prev.map(j => (j._id === jobId ? updatedData : j))
            );

            // Close dialog
            setEditOpen(false);

            // Refetch the fresh page from server
            fetchJobs(currentPage, itemsPerPage);

        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.error || "Updation failed");
            } else {
                toast.error("Something went wrong. Please try again.");
            }

        }

    };

    //edit dialog-------------



    // Fetch jobs
    useEffect(() => {
        fetchJobs(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage, filters]);


    const fetchJobs = async (page = 1, limit = itemsPerPage) => {
        try {
            setLoading(true);

            const params = {
                page,
                limit,
                createdDate: filters.createdDate,
                requestedDate: filters.requestedDate,
                service_type: filters.serviceType !== "all" ? filters.serviceType : undefined,
                job_status: filters.jobStatus !== "all" ? filters.jobStatus : undefined,

            }
            const res = await getAllJobsService(params);
            const result = res.data;

            setJobs(result.data || []);
            setTotalPages(result.totalPages || 1);
            setCurrentPage(result.currentPage || 1);
        } catch (error) {
            console.log("Failed to load jobs", error);
        } finally {
            setLoading(false);
        }
    };



    const hasActiveFilters =
        filters.createdDate !== "all" ||
        filters.requestedDate !== "all" ||
        filters.serviceType !== "all" ||
        filters.jobStatus !== "all";

    const handleClearFilters = () => {
        setFilters({
            createdDate: "all",
            requestedDate: "all",
            serviceType: "all",
            jobStatus: "all",
        });
        setCurrentPage(1);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {loading && <FullPageLoader />}


            <h1 className="text-2xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">
                Manage and view all jobs assigned to you or created by users.
            </p>

            <JobFilters
                filters={filters}
                onChange={(newFilters) => {
                    setFilters(newFilters);
                    setCurrentPage(1); // reset pagination
                }}
                onClear={() => {
                    setFilters({
                        createdDate: "all",
                        requestedDate: "all",
                        serviceType: "all",
                        jobStatus: "all",
                    });
                    setCurrentPage(1);
                }}
            />


            <Card className="p-4">
                {/* Table Header */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Pickup</TableHead>
                            <TableHead>Drop-off</TableHead>
                            <TableHead>Service Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Requested Date</TableHead>
                            <TableHead>Created Date</TableHead>

                            <TableHead className="text-center">Actions</TableHead>
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
                        ) : jobs.length === 0 ? (
                            // <TableRow className="flex justify-center items-center">
                            //     <TableCell colSpan="5" className="text-center py-6 text-muted-foreground  ">
                            //         No jobs found.
                            //     </TableCell>
                            // </TableRow>
                            <TableRow>
                                <TableCell colSpan={11}>
                                    <EmptyState
                                        icon={SearchX}
                                        title="No jobs found"
                                        description={
                                            hasActiveFilters
                                                ? "No jobs match the selected filters."
                                                : "Jobs assigned to you will appear here."
                                        }
                                        actionLabel={hasActiveFilters ? "Clear filters" : null}
                                        onAction={hasActiveFilters ? handleClearFilters : null}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job) => (
                                <TableRow key={job._id}>
                                    <TableCell className="font-medium">{job.booking_id}</TableCell>
                                    <TableCell>{job.client_id?.name}</TableCell>
                                    <TableCell>{job.client_id?.phone}</TableCell>
                                    <TableCell>{job.pickup_location?.name}</TableCell>
                                    <TableCell>{job.dropoff_location?.name}</TableCell>
                                    <TableCell>{job.service_type}</TableCell>
                                    <TableCell>
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
                                    </TableCell>

                                    <TableCell>
                                        {job.payment ? (
                                            <Badge
                                                variant={
                                                    job.payment.payment_status === "completed"
                                                        ? "success"
                                                        : job.payment.payment_status === "pending"
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
                                    </TableCell>
                                    <TableCell>{formatDate(job.requested_date_time)}</TableCell>
                                    <TableCell>{formatDate(job.created_at)}</TableCell>

                                    <TableCell className="text-right flex justify-end gap-2">
                                        {/* <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm" variant="secondary" >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                View
                                            </TooltipContent>
                                        </Tooltip> */}

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4 mr-1" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Edit
                                            </TooltipContent>
                                        </Tooltip>



                                    </TableCell>
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
            {selectedJob && (
                <EditJobDialog
                    job={selectedJob}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onUpdate={handleJobUpdate}
                />
            )}


        </div>
    );
};




export default JobList;
