import React from 'react'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const ProviderCard = ({provider}) => {
       
  return (
    <div>
         <Card key={provider._id} className="p-5 flex justify-between items-center">
          <div>
            
            <h3 className="text-xl font-bold">{provider.name}</h3>
            <p className="text-sm text-muted-foreground">
              {provider.email}
            </p>
            <p className="text-sm">{provider.phone}</p>
          </div>

          <Button>Book Now</Button>
        </Card>
    </div>
  )
}

export default ProviderCard