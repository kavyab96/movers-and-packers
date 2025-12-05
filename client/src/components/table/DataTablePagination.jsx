import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const DataTablePagination = ({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}) => {
    return (
        <div className="flex items-center justify-between mt-4 w-full">
            
           

            {/* Pagination */}
            <Pagination className="w-50">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={currentPage === index + 1}
                                onClick={() => onPageChange(index + 1)}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>




             {/* Items per page */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground ">Rows per page:</span>

                <Select
                    value={String(itemsPerPage)}
                    onValueChange={(value) => onItemsPerPageChange(Number(value))}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                </Select>
            </div>

        </div>
    );
};

export default DataTablePagination;
