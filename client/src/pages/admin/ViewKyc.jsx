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

import { getProviderKycService } from "../../services/adminServices";

const ViewKyc = ({ provider, open, onOpenChange }) => {
  const [kycDocs, setKycDocs] = useState([]);
  const [loading, setLoading] = useState(false);

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

  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            KYC Documents – {provider.name}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : kycDocs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No KYC documents uploaded.
          </p>
        ) : (
          <div className="space-y-3">
            {kycDocs.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div>
                  <p className="text-sm font-medium capitalize">
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

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc.file_url, "_blank")}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewKyc;
