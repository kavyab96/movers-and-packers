import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const Feature = ({ title, text }) => (
  <div className="flex gap-3">
    <div className="flex items-center justify-center rounded-full bg-primary/10 w-10 h-10">
      <Check className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h4 className="text-sm font-semibold leading-5">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="w-full ">

      <section className="w-full mt-5">
        <div className='w-full flex flex-col justify-center items-center'>

          <div className='w-[50% p-5 flex flex-col  justify-center items-center'>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Find Trusted Service Providers — by Location, Date & Service Type
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl">
              We connect you with verified local professionals for movers & packers, plumbing, electrical, cleaning and more — available on your chosen date and location.
            </p>
          </div>


          <div className="w-[50%] mt-6 flex flex-wrap gap-3 items-center justify-center">
            <Button asChild>
              <Link to="/">Find Providers</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/signup">Become a Provider</Link>
            </Button>
          </div>

        </div>



        <div className="w-full mt-6 bg-gray-200 dark:bg-blue-400 grid gap-2 md:grid-cols-3 place-items-center p-5 ">
          <div className='w-[50%] flex flex-col justify-center items-center'>
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-muted-foreground dark:text-black">Bookings completed</div>
          </div>
          <div className='w-[50%]  flex flex-col justify-center items-center'>
            <div className="text-2xl font-bold">3.5K+</div>
            <div className="text-sm text-muted-foreground dark:text-black">Verified providers</div>
          </div>
          <div className='w-[50%]  flex flex-col justify-center items-center '>
            <div className="text-2xl font-bold">99%</div>
            <div className="text-sm text-muted-foreground dark:text-black">On-time delivery</div>
          </div>
        </div>

        <div className='w-full mt-10 flex  flex-wrap justify-center items-center gap-15'>
          <Card className="shadow-lg w-[40%]">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>

            <CardContent>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  <strong>Select location</strong> — choose the area where you need service.
                </li>
                <li>
                  <strong>Pick a date & service</strong> — see providers available on that day.
                </li>
                <li>
                  <strong>Compare & book</strong> — choose the provider, confirm booking and chat securely.
                </li>
              </ol>

              <div className="grid gap-3 mt-5">
                <Feature title="Verified Professionals" text="Background-checked providers for peace of mind." />
                <Feature title="Real-time Availability" text="Providers show availability for your selected date." />
                <Feature title="Transparent Pricing" text="Clear, upfront estimates with no hidden charges." />
              </div>
            </CardContent>
          </Card>


          <Card className="shadow-lg w-[40%] ">
            <CardHeader className='p-5'>
              <CardTitle className='mb-5'>Why choose our platform</CardTitle>
              <p className="text-muted-foreground max-w-prose">
                We simplify local service booking by combining location-based search, date availability and verified professionals. Whether it's moving day or a quick repair—book trusted help in minutes.
              </p>
            </CardHeader>

             <CardContent className="grid sm:grid-cols-2 gap-4 mt-4">
               <Feature title="Location-first search" text="Only see providers who actually serve your area." />
            <Feature title="Date availability" text="Providers show available slots for the date you need." />
            <Feature title="Secure communication" text="Chat and confirm jobs inside the app." />
            <Feature title="Ratings & reviews" text="Choose from top-rated local experts." />
             </CardContent>

          </Card>



        </div>






      </section>


       {/* VALUES / CTA */}
      <section className="w-full p-5 mt-10">
        <div className='w-full p-2 flex  flex-col items-center justify-center'>
          <h3 className="text-2xl font-semibold">Our values</h3>
          <p className="text-muted-foreground mt-2">
            We prioritize trust, transparency and convenience. Our platform empowers both customers and local professionals to complete jobs fairly and reliably.
          </p>

          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-1" />
              <span>Safety-first — verified providers and secure payments.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-1" />
              <span>Transparent pricing — no surprise charges.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-1" />
              <span>Customer-first support — we’re here to help at every step.</span>
            </li>
          </ul>

         
        </div>

       
      </section>
    </div>
  )
}

export default About