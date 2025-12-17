import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const JobFilters = ({ filters, onChange, onClear }) => {
  
  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4 items-center justify-center ">

        {/* Created Date */}
        <Select
          value={filters.createdDate}
          onValueChange={(value) =>
            onChange({ ...filters, createdDate: value })
          }
        >
          {/* <SelectTrigger className="w-44"> */}
          <SelectTrigger className="">
            <SelectValue placeholder="Created date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All created date</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>

        {/* Requested Date */}
        <Select
          value={filters.requestedDate}
          onValueChange={(value) =>
            onChange({ ...filters, requestedDate: value })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Requested date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All requested date</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>

        {/* Service Type */}
        <Select
          value={filters.serviceType}
          onValueChange={(value) =>
            onChange({ ...filters, serviceType: value })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            <SelectItem value="moving">Moving</SelectItem>
            <SelectItem value="packing">Packing</SelectItem>
            <SelectItem value="both">Moving + Packing</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status */}
        <Select
          value={filters.jobStatus}
          onValueChange={(value) =>
            onChange({ ...filters, jobStatus: value })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Job status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="in-progress">In-progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </Card>
  );
};

export default JobFilters;
