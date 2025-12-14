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
import { Eye, Pencil, Trash, MapPinPlusInside } from "lucide-react";

import FullPageLoader from "../../components/loaders/FullPageLoader";
import DataTablePagination from "../../components/table/DataTablePagination";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getAllAreaService, updateAreaService, createAreaService, deleteAreaService } from "../../services/adminServices";
import EditServiceAreaDialog from "./EditServiceAreaDialog";
import AddServiceAreaDialog from "./AddServiceAreaDialog";


import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";




const ServiceAreasList = () => {

    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);


    //edit dialog-------------
    const [selectedArea, setSelectedArea] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const handleUpdate = async (areaId, updatedData) => {
        try {
            // API call
            await updateAreaService(areaId, updatedData)
            toast.success("Service Area updated successfully");

            // Update UI with real backend data
            setAreas(prev =>
                prev.map(area => (area._id === areaId ? updatedData : area))
            );
            // Close dialog
            setEditOpen(false);
            // Refetch the fresh page from server
            fetchAreas(currentPage, itemsPerPage);

        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.error || "Updation failed");
            } else {
                toast.error("Something went wrong. Please try again.");
            }

        }

    };

    //edit dialog-------------

    // Add Dialog--------------------------
    const [addOpen, setAddOpen] = useState(false);

    const handleCreate = async (newData) => {
        try {
            await createAreaService(newData);
            toast.success("Service Area added successfully");

            setAddOpen(false);
            fetchAreas(currentPage, itemsPerPage);
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.error || "Failed to add");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    }
    // Add Dialog--------------------------

    // delete--------------------------
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteArea, setDeleteArea] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = async () => {
        if (!deleteArea?._id) return;

        try {
            setDeleteLoading(true);
            await deleteAreaService(deleteArea._id);

            toast.success("Service Area deleted successfully");
            setDeleteOpen(false);
            setDeleteArea(null);
            fetchAreas(currentPage, itemsPerPage);
        } catch (error) {
            const status = error?.response?.status;
            if (status >= 400 && status < 500) {
                toast.error(error.response.data.error || "Failed to delete service area");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setDeleteLoading(false);
        }
    };


    // delete--------------------------




    // Fetch area
    useEffect(() => {
        fetchAreas(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);


    const fetchAreas = async (page = 1, limit = itemsPerPage) => {
        try {
            setLoading(true);

            const params = { page, limit }
            const res = await getAllAreaService(params);
            const result = res.data;

            setAreas(result.data || []);
            setTotalPages(result.totalPages || 1);
            setCurrentPage(result.currentPage || 1);
            setTotal(result.total || 0)
        } catch (error) {
            console.log("Failed to load Service Areas", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {loading && <FullPageLoader />}  
            <h1 className="text-2xl font-bold">Areas</h1>

            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Total : {total}</p>

                {/* add btn  */}
                <Tooltip className ="bg-amber-600 w-full">
                    <TooltipTrigger asChild>
                        <Button onClick={() => setAddOpen(true)} className="p-5 w-14">
                            <MapPinPlusInside />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Add Service Area
                    </TooltipContent>
                </Tooltip>
            </div>


            <Card className="p-4">
                {/* Table Header */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Area</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Postal Codes</TableHead>
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
                        ) : areas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center py-6 text-muted-foreground">
                                    No area found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            areas.map((area) => (
                                <TableRow key={area._id}>
                                    <TableCell className="font-medium">{area.name}</TableCell>
                                    <TableCell className="font-medium">{area.city}</TableCell>
                                    <TableCell className="font-medium">{area.state}</TableCell>
                                    <TableCell className="font-medium">{area.postal_code}</TableCell>

                                    <TableCell className="text-center flex justify-center gap-2">

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedArea(area);
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

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setDeleteArea(area);
                                                        setDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash className="h-4 w-4 mr-1" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Delete
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
            {selectedArea && (
                <EditServiceAreaDialog
                    area={selectedArea}
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    onUpdate={handleUpdate}
                />
            )}

            {/* add dialog  */}
            <AddServiceAreaDialog
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onCreate={handleCreate}
            />



            {/* delete dialog  */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Service Area?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <b>{deleteArea?.name}</b>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? "Deleting..." : "Yes, Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* delete dialog  */}




        </div>
    );
};




export default ServiceAreasList;
