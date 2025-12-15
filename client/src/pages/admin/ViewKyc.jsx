import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ShieldCheck, XCircle } from "lucide-react";

import {
    getProviderKycService,
    verifyKycDocumentService,
} from "../../services/adminServices";

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";


const ViewKyc = ({ provider, open, onOpenChange }) => {
    const [kycDocs, setKycDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        if (open && provider?._id) {
            fetchKycDocs();
        }
    }, [open, provider]);

    const fetchKycDocs = async () => {
        try {
            setLoading(true);
            const res = await getProviderKycService(provider._id);
            setKycDocs(res.data.data || []);
        } catch (error) {
            toast.error("Failed to load KYC documents");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (docId, status) => {
        try {
            setUpdatingId(docId);
            await verifyKycDocumentService(docId, status);
            toast.success(`Document ${status}`);
            fetchKycDocs(); // refresh list
        } catch (error) {
            toast.error("Failed to update document status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (!provider) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[70%]">
                <DialogHeader>
                    <DialogTitle>
                        KYC Documents – {provider.name}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                    </div>
                ) : kycDocs.length === 0 ? (
                    <p className="text-xs md:text-sm text-muted-foreground">
                        No KYC documents uploaded.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {kycDocs.map((doc) => (
                            <div
                                key={doc._id}
                                className="
                                    grid gap-3
                                    grid-cols-1
                                    sm:grid-cols-[1fr_auto]
                                    items-start
                                    border rounded-md p-3
                                    "
                            >
                                {/* LEFT */}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium capitalize truncate">
                                        {doc.document_type.replace("_", " ")}
                                    </p>

                                    <Badge
                                        className="mt-1"
                                        variant={
                                            doc.status === "approved"
                                                ? "success"
                                                : doc.status === "rejected"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {doc.status}
                                    </Badge>
                                </div>

                                {/* RIGHT ACTIONS */}

                                <div className=" flex items-center gap-2
                                        justify-start
                                        sm:justify-end
                                        w-full sm:w-auto">
                                    {/* View */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(doc.file_url, "_blank")}
                                    >
                                        View
                                    </Button>

                                    {/* APPROVE (show only if NOT approved) */}
                                    {doc.status !== "approved" && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    disabled={updatingId === doc._id}
                                                    onClick={() => handleVerify(doc._id, "approved")}
                                                >
                                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Approve document</TooltipContent>
                                        </Tooltip>
                                    )}

                                    {/* REJECT (show only if NOT rejected) */}
                                    {doc.status !== "rejected" && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    disabled={updatingId === doc._id}
                                                    onClick={() => handleVerify(doc._id, "rejected")}
                                                >
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Reject document</TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>


                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ViewKyc;
