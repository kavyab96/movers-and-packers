import React from "react";
import ServiceSearchForm from "@/components/search/ServiceSearchForm";
import { useAreas } from "../../context/AreaContext";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, Clock } from "lucide-react";

const HomePage = () => {
  const { areas } = useAreas();
  const navigate = useNavigate();

  const handleSearch = ({ pickup, dropoff, date }) => {
    navigate(`/providers?pickup=${pickup}&dropoff=${dropoff}&date=${date}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/40 to-background">


      {/* HERO */}
      <section className="min-h-[75vh] flex items-center mt-15 md:mt-0">
        <div className="max-w-6xl mx-auto px-4 text-center flex flex-col gap-8
             animate-in fade-in slide-in-from-bottom-10 duration-700">

          {/* BRAND NAME */}
          <span className="text-3xl md:text-5xl font-bold tracking-wide text-primary">
            TransitBee
          </span>

          <h1 className="text-xl md:text-2xl font-semibold leading-tight">
            Find Trusted Movers & Packers Near You
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare verified moving professionals, choose your date,
            and book instantly — stress free.
          </p>

          {/* SEARCH FORM (UNCHANGED) */}
          <div className="">
            <ServiceSearchForm areas={areas} onSubmit={handleSearch} />
          </div>

        </div>
      </section>

      {/* TRUST BAR */}
      <section className="max-w-4xl mx-auto px-4 mt-20 md:mt-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-3 justify-center
        transition-all duration-300 hover:-translate-y-1 hover:text-primary">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-medium">Verified Providers</span>
        </div>

        <div className="flex items-center gap-3 justify-center
         transition-all duration-300 hover:-translate-y-1 hover:text-primary">
          <Clock className="h-6 w-6 text-primary" />
          <span className="font-medium">Quick Booking</span>
        </div>

        <div className="flex items-center gap-3 justify-center
         transition-all duration-300 hover:-translate-y-1 hover:text-primary">
          <Truck className="h-6 w-6 text-primary" />
          <span className="font-medium">Local Movers</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-semibold text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <span className="text-4xl font-bold text-primary">1</span>
            <p className="mt-3 font-medium">Choose pickup & drop location</p>
          </div>

          <div>
            <span className="text-4xl font-bold text-primary">2</span>
            <p className="mt-3 font-medium">Compare service provider</p>
          </div>

          <div>
            <span className="text-4xl font-bold text-primary">3</span>
            <p className="mt-3 font-medium">Book & relax</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
