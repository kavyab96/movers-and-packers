import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProviders } from "../../services/userServices";
import { toast } from "sonner";
import ProviderCard from "./ProviderCard";
import { useNavigate } from "react-router-dom";
import { CircleChevronLeft } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";


const ProviderResults = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickup = params.get("pickup");
    const dropoff = params.get("dropoff");
    const date = params.get("date");


    useEffect(() => {
        const fetchData = async () => {
             setLoading(true);
            try {
                const data = {
                    pickup,
                    dropoff,
                    date
                };
                const res = await searchProviders(data);
                setProviders(res.data.data || []);
            } catch (err) {
                toast.error("error")
                // console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pickup, dropoff, date]);

    // console.log(providers);


    return (
        <div className="max-w-6xl mx-auto p-3 mt-10 space-y-4">

            <div className="flex gap-3">

                {/* Back Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => navigate(-1)}
                                className="
                                inline-flex items-center
                                text-sm font-medium
                                text-muted-foreground
                                hover:text-foreground
                                transition"
                            >
                                <CircleChevronLeft className="w-4 h-4" />
                            </button>
                        </TooltipTrigger>

                        <TooltipContent side="top">
                            <p>Go back</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <h2 className="text-2xl font-semibold my-10">
                    Available Providers
                </h2>
            </div>

            {/* {loading && <p>Loading providers...</p>} */}

            {!loading && providers.length === 0
                ? (
                    <p>No providers found for your search.</p>
                )
                : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {providers.map((item) => (
                            <ProviderCard
                                key={item._id}
                                provider={item}

                            />
                        ))}
                    </div>


                )

            }






        </div>
    )
}

export default ProviderResults