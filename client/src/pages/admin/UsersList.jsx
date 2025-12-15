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
import { Eye, Pencil, ShieldCheck, XCircle } from "lucide-react";

import FullPageLoader from "../../components/loaders/FullPageLoader";
import DataTablePagination from "../../components/table/DataTablePagination";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getAllUsersService } from "../../services/adminServices";
import { formatDate } from "../../utils/format";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import VerifyProvider from "./VerifyProvider";
import ViewKyc from "./ViewKyc";



// import EditJobDialog from "../provider/EditJobDialog"

const UserList = () => {

    /*kyc dialog states*/
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [viewKycOpen, setViewKycOpen] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState("pending");


    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    //filters
    // const [search, setSearch] = useState("");
    // const [role, setRole] = useState("all"); 
    const [filters, setFilters] = useState({
        search: "",
        role: "all",// all | user | provider
    });


    //edit dialog-------------
    // const [selectedJob, setSelectedJob] = useState(null);
    // const [editOpen, setEditOpen] = useState(false);

    // const handleJobUpdate = async (jobId, updatedData) => {
    //     try {
    //         // API call
    //         await updateuserservice(jobId, updatedData)
    //         toast.success("Job updated successfully");

    //         // Update UI with real backend data
    //         setUsers(prev =>
    //             prev.map(j => (j._id === jobId ? updatedData : j))
    //         );

    //         // Close dialog
    //         setEditOpen(false);

    //         // Refetch the fresh page from server
    //         fetchUsers(currentPage, itemsPerPage);

    //     } catch (error) {
    //         if (error.response?.status === 400) {
    //             toast.error(error.response.data.error || "Updation failed");
    //         } else {
    //             toast.error("Something went wrong. Please try again.");
    //         }

    //     }

    // };

    //edit dialog-------------



    // Fetch users
    useEffect(() => {
        fetchUsers(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage, filters]);


    const fetchUsers = async (page = 1, limit = itemsPerPage) => {
        try {
            setLoading(true);

            const params = {
                page,
                limit,
                search: filters.search || undefined,
                role: filters.role !== "all" ? filters.role : undefined,
            }
            const res = await getAllUsersService(params);
            const result = res.data;

            setUsers(result.data || []);
            setTotalPages(result.totalPages || 1);
            setCurrentPage(result.currentPage || 1);
            setTotal(result.total || 0)
        } catch (error) {
            console.log("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl  space-y-6">
            {loading && <FullPageLoader />}


            <h1 className="text-2xl font-bold">users</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center">
                <p className="text-muted-foreground">
                    Total : {total}
                </p>

                {/* <div className="flex gap-3"> */}
               <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    {/* Role Filter */}
                    <Select
                        value={filters.role}
                        onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, role: value }));
                            setCurrentPage(1);
                        }}
                    >
                       <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="provider">Provider</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search users/phone/Email..."
                        value={filters.search}
                        onChange={(e) => {
                            setFilters((prev) => ({ ...prev, search: e.target.value }));
                            setCurrentPage(1);
                        }}
                        className="
                        h-9 w-full sm:w-64
                        rounded-md border border-input
                        bg-background px-3 text-sm
                        shadow-sm
                        focus:outline-none focus:ring-1 focus:ring-ring
                        "
                        // className="h-9 w-[50%] rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
            </div>




            <Card className="p-4">
                <div className="overflow-x-auto">

                {/* Table Header */}
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Joined Date</TableHead>
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
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-6 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.address}</TableCell>
                                    <TableCell>{formatDate(user.created_at)}</TableCell>

                                    {/*<TableCell>
                                        <Badge
                                            variant={
                                                user.status === "completed"
                                                    ? "success"
                                                    : user.status === "in-progress"
                                                        ? "default"
                                                        : "secondary"
                                            }
                                            className="capitalize"
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell> */}

                                    <TableCell className="text-right flex justify-end gap-2">
                                        {user.role === "provider" && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() => {
                                                            setSelectedProvider(user);
                                                            setViewKycOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>View KYC</TooltipContent>
                                            </Tooltip>
                                        )}

                                        {/* Verify Provider */}
                                        {user.role === "provider" && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedProvider(user);
                                                            setVerifyOpen(true);
                                                        }}
                                                    >
                                                        <ShieldCheck className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Verify Provider</TooltipContent>
                                            </Tooltip>
                                        )}

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

                                        {/* <Tooltip>
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
                                        </Tooltip> */}



                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                </div>
                  
            </Card>

            <div className="w-full flex items-center justify-center">           
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
           
             </div>


            {/* edit dialog component */}
            {/* {selectedJob && (
                <EditJobDialog
                    job={selectedJob}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onUpdate={handleJobUpdate}
                />
            )} */}
            {/* Verify KYC Dialog */}
            {selectedProvider && (
                <VerifyProvider
                    provider={selectedProvider}
                    open={verifyOpen}
                    onOpenChange={setVerifyOpen}
                    fetchUsers={fetchUsers}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                />
            )}

            {/* View KYC Dialog */}
            {selectedProvider && (
                <ViewKyc
                    provider={selectedProvider}
                    open={viewKycOpen}
                    onOpenChange={setViewKycOpen}
                />
            )}


        </div>
    );
};




export default UserList;
