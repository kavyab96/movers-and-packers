// import React from 'react'
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// const ProviderCard = ({provider}) => {
       
//   return (
//     <div>
//          <Card key={provider._id} className="p-5 flex justify-between items-center">
//           <div>
            
//             <h3 className="text-xl font-bold">{provider.name}</h3>
//             <p className="text-sm text-muted-foreground">
//               {provider.email}
//             </p>
//             <p className="text-sm">{provider.phone}</p>
//           </div>

//           <Button>Book Now</Button>
//         </Card>
//     </div>
//   )
// }

// export default ProviderCard

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Mail, Phone, User } from "lucide-react";

const ProviderCard = ({ provider }) => {
  const initials = provider?.name
    ?.split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="p-5 rounded-2xl hover:shadow-md transition-shadow">
      {/* GRID LAYOUT */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
        
        {/* Avatar column */}
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={provider.profile_pic}
            alt={provider.name}
          />
          <AvatarFallback className="font-semibold">
            {initials || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>

        {/* Info column */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            {provider.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{provider.email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{provider.phone}</span>
          </div>
        </div>

        {/* Button column */}
        {/* <Button className="rounded-xl self-center">
          Book Now
        </Button> */}
      </div>
    </Card>
  );
};

export default ProviderCard;

