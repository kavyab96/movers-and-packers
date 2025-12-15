import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { verifyProviderService } from "../../services/adminServices";

const VerifyProvider = ({
  provider,
  open,
  onOpenChange,
  fetchUsers,
  currentPage,
  itemsPerPage,
}) => {
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [submitting, setSubmitting] = useState(false);

  //  Set default value from backend when dialog opens / provider changes
  useEffect(() => {
    if (provider?.verification_status) {
        // alert(1)
        // console.log(provider.verification_status,'from popup');
        
      setVerificationStatus(provider.verification_status);
    }
  }, [provider]);

  if (!provider) return null;

  const handleSubmit = async () => {
    try {
      if (!provider?._id) {
        toast.error("Invalid provider");
        return;
      }

      setSubmitting(true);

      await verifyProviderService(
        provider._id,
        verificationStatus
      );

      toast.success("Provider verification updated");
      onOpenChange(false);
      fetchUsers(currentPage, itemsPerPage);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Verification failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Verify Provider – {provider.name}
          </DialogTitle>
        </DialogHeader>

        <Select
          value={verificationStatus}
          onValueChange={setVerificationStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyProvider;
