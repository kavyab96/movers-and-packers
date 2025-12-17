import { useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UploadCloud, XCircle, FileText, CircleMinus } from "lucide-react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { uploadKycService, deleteKycDocumentService } from "../../services/providerServices";

const ProviderKycCard = ({ user, kycDocs = [], refreshKycDocs }) => {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
  };

  //  Clear selected file
  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file || !documentType) {
      toast.error("Please select document type and file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("document_type", documentType);
      formData.append("doc", file);

      await uploadKycService(formData);
      toast.success("KYC document uploaded successfully");

      refreshKycDocs && refreshKycDocs();
      // reset state
      setDocumentType("");
      handleClearFile();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to upload document"
      );
    } finally {
      setUploading(false);
    }
  };


  const handleDeleteKyc = async (docId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this KYC document?"
    );

    if (!confirmDelete) return;

    try {
      await deleteKycDocumentService(docId);
      toast.success("KYC document deleted successfully");

      refreshKycDocs && refreshKycDocs();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete document"
      );
    }
  };




  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>KYC Document</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 ">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">


          <div className="md:col-span-4">
            <label className="text-sm font-medium mb-1 block">
              Document Type
            </label>

            <div className="relative">
              <Select
                value={documentType}
                onValueChange={setDocumentType}
              >
                <SelectTrigger className="w-full pr-10">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="license">Driving License</SelectItem>
                  <SelectItem value="voter_id">Voter ID</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* ❌ Clear document type */}
              {documentType && (
                <button
                  type="button"
                  onClick={() => setDocumentType("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                   text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>
          </div>


          {/* 📎 File Upload */}
          <div className="md:col-span-4">
            <label className="text-sm font-medium mb-1 block">
              Upload Document
            </label>

            {!file ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={18} />
                Choose File
              </Button>
            ) : (
              <div className="flex items-center justify-between border rounded-md px-3 py-2">
                <div className="flex items-center gap-2 text-sm truncate">
                  <FileText size={18} />
                  <span className="truncate ">{file.name}</span>
                </div>

                {/*  Clear Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearFile}
                >
                  <XCircle className="text-gray-500" size={18} />
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/*  Upload Button */}
          <Button
            className="w-full md:col-span-4 bg-linear-to-r from-green-300 to-sky-400  hover:opacity-100"
            disabled={!file || !documentType || uploading}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>





        {/* ===== Existing Uploaded Documents ===== */}
        {kycDocs.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">
              Uploaded Documents
            </h3>

            <div className="space-y-3">
              {kycDocs.map((doc) => (

                <div
                  key={doc._id}
                  // className="flex items-center justify-between border rounded-md px-4 py-2"
                  className="
                    grid grid-cols-1 gap-3
                    sm:grid-cols-2
                    md:grid-cols-3
                    items-center
                    border rounded-md px-4 py-3
                    w-full
                  "
                >

                  <div className=""> 
                    <p className="text-sm font-medium capitalize">
                      {doc.document_type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded on{" "}
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>


                  <div
                    // className="flex items-center gap-3"
                    className="flex items-center gap-3 flex-wrap md:col-start-3 sm:justify-end"
                  >
                    {/* Status */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${doc.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {doc.status}
                    </span>

                    {/* View */}
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline"
                    >
                      View
                    </a>

                    {/* Delete */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleDeleteKyc(doc._id)}
                          className="h-5 w-5 flex items-center justify-center
                                  rounded-full
                                  bg-red-500
                                  hover:bg-red-600
                                  transition"
                            aria-label="Delete KYC document"
                        >
                          <CircleMinus className="h-5 w-5 text-white" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Delete document
                      </TooltipContent>
                    </Tooltip>
                  </div>

                </div>

              ))}
            </div>


          </div>
        )}
        {/* ===== Existing Uploaded Documents ===== */}


      </CardContent>
    </Card>
  );
};

export default ProviderKycCard;
