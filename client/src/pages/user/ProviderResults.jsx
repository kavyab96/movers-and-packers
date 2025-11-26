import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProviders } from "../../services/userServices";
import { toast } from "sonner";
import ProviderCard from "./ProviderCard";


const ProviderResults = () => {
    const [params] = useSearchParams();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickup = params.get("pickup");
    const dropoff = params.get("dropoff");
    const date = params.get("date");


    useEffect(() => {
        const fetchData = async () => {

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

    console.log(providers);


    return (
        <div className="max-w-4xl mx-auto p-5 space-y-4">
            <h2 className="text-2xl font-semibold mb-5">
                Available Providers
            </h2>

            {/* {loading && <p>Loading providers...</p>} */}

            {!loading && providers.length === 0
                ? (
                    <p>No providers found for your search.</p>
                )
                : (
                    <>
                        {providers.map((item) => (
                            <ProviderCard
                                key={item._id}
                                provider={item}

                            />
                        ))}
                    </>


                )

            }






        </div>
    )
}

export default ProviderResults