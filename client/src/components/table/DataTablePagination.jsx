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

const getPaginationRange = (currentPage, totalPages, delta = 2) => {
    const range = [];
    const rangeWithDots = [];
    let lastPage;

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            range.push(i);
        }
    }

    for (const page of range) {
        if (lastPage) {
            if (page - lastPage === 2) {
                rangeWithDots.push(lastPage + 1);
            } else if (page - lastPage > 2) {
                rangeWithDots.push("...");
            }
        }
        rangeWithDots.push(page);
        lastPage = page;
    }

    return rangeWithDots;
};


const DataTablePagination = ({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    disabled = false,
}) => {

    const pages = getPaginationRange(currentPage, totalPages);

    return (
        // <div className="flex items-center justify-between mt-4 w-full">
        <div className="
            mt-4 w-full
            flex flex-col gap-3
            sm:flex-row sm:items-center sm:justify-between
            ">



            {/* Pagination */}
            <Pagination className="w-full sm:w-auto flex justify-center">
                <PaginationContent className="flex flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => !disabled && currentPage > 1 && onPageChange(currentPage - 1)}
                            className={disabled || currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>

                    {/* {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={!disabled && currentPage === index + 1}
                                onClick={() => onPageChange(index + 1)}
                                className={disabled ? "pointer-events-none opacity-50" : ""}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))} */}
                    {pages.map((page, index) => (
                        <PaginationItem key={index}>
                            {page === "..." ? (
                                <span className="px-3 text-muted-foreground">…</span>
                            ) : (
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => onPageChange(page)}
                                    className={disabled ? "pointer-events-none opacity-50" : ""}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}


                    <PaginationItem>
                        <PaginationNext
                            onClick={() => !disabled && currentPage < totalPages && onPageChange(currentPage + 1)}
                            className={disabled || currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>




            {/* Items per page */}
            <div className="flex items-center justify-center sm:justify-end gap-2">
                <span className="text-sm sm:text-sm text-muted-foreground ">Rows per page:</span>

                <Select
                    disabled={disabled}
                    value={String(itemsPerPage)}
                    onValueChange={(value) => onItemsPerPageChange(Number(value))}
                >
                    <SelectTrigger className="w-20 h-8 sm:h-9">
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
