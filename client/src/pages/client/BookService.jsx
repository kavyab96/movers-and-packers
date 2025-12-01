import ServiceSearchForm from "@/components/search/ServiceSearchForm";
import { useAreas } from "../../context/AreaContext";
import { useState } from "react";
import { searchProviders } from "../../services/userServices";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import BookingForm from "./BookingForm"


import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";


const BookService = () => {
  const { areas } = useAreas();
  // const [open, setOpen] = useState(false)


  
  //selected provider for dialog
  const [selectedProvider, setSelectedProvider] = useState(null);


  const [providers, setProviders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastSearchValues, setLastSearchValues] = useState(null);
  const itemsPerPage = 5;

  //   const handleSearch = async({ pickup, dropoff, date }, page = 1)) => {
  //   try {
  //     const data = { pickup, dropoff, date, page, limit: 5 };
  //     const res = await searchProviders(data);
  //     setTotalPages(res.data.totalPages);
  //     setCurrentPage(res.data.currentPage);
  //     setProviders(res.data.data);
  //   } catch {
  //     toast.error("Unable to load providers");
  //   }
  // };

  // This runs for pagination navigation clicks
  const handlePageChange = (page) => {
    if (!lastSearchValues) return;
    fetchProviders(lastSearchValues, page);
  };

  // This runs when user clicks Search
  const handleSearch = async (values) => {
    setLastSearchValues(values);
    await fetchProviders(values, 1);
  };

  // FETCH PROVIDERS WITH PAGINATION
  const fetchProviders = async (values, page = 1) => {
    try {
      const params = {
        ...values,
        page,
        limit: itemsPerPage,
      };

      const res = await searchProviders(params);

      setProviders(res.data.data);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Unable to load providers");
    }
  };

  return (
    <div>
      <ServiceSearchForm areas={areas} onSubmit={handleSearch} />

      {providers.length > 0 && (
        <div className="mt-12 w-full">
          <h2 className="text-xl font-bold mb-4">Available Providers</h2>

          <Table >
            {/* <TableCaption>List of providers available for your route.</TableCaption> */}

            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service Areas</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {providers.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone}</TableCell>

                  {/* service areas */}
                  <TableCell>
                    {p.service_areas.length === 0 ? (
                      <span>No areas</span>
                    ) : (
                      <div className="flex items-center gap-2">

                        {/* Always show the FIRST area */}
                        <Badge variant="secondary">
                          {p.service_areas[0].name}
                        </Badge>

                        {/* If more than one area, show +X more */}
                        {p.service_areas.length > 1 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Badge variant="outline" className="cursor-pointer">
                                +{p.service_areas.length - 1} more
                              </Badge>
                            </PopoverTrigger>

                            <PopoverContent className="w-40 p-2 space-y-2">
                              {p.service_areas.slice(1).map((area) => (
                                <Badge
                                  key={area._id}
                                  variant="secondary"
                                  className="w-full justify-center"
                                >
                                  {area.name}
                                </Badge>
                              ))}
                            </PopoverContent>
                          </Popover>
                        )}

                      </div>
                    )}
                  </TableCell>



                  <TableCell className="text-right">
                    <button
                      onClick={() => setSelectedProvider(p)}
                      className="px-3 py-1 bg-primary text-white dark:text-black rounded-md hover:bg-primary/90"
                    >
                      Book Now
                    </button>
                  </TableCell>
                  {/* <TableCell className="text-right">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild onClick={() => setOpen(true)}>


                        <button className="px-3 py-1 bg-primary text-white dark:text-black rounded-md hover:bg-primary/90">
                          Book Now
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <BookingForm provider={p} areas={areas} onClose={() => setOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  </TableCell> */}


                </TableRow>
              ))}
            </TableBody>
          </Table>



          {/* PAGINATION */}
          <Pagination className="mt-6">
            <PaginationContent>

              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && handlePageChange(currentPage + 1)
                  }
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>

        </div>
      )}


      {/* SINGLE DIALOG — handles ALL rows */}
      {selectedProvider && (
        <Dialog
          open={!!selectedProvider}
          onOpenChange={() => setSelectedProvider(null)}
        >
          <DialogContent className="max-w-lg">
            <BookingForm
              provider={selectedProvider}
              areas={areas}
              onClose={() => setSelectedProvider(null)}
            />
          </DialogContent>
        </Dialog>
      )}


    </div>
  );
};

export default BookService;
