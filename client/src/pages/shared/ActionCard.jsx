import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ActionCard = ({ title, link }) => {
  return (
    <Card className="border shadow-sm hover:shadow-md transition">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Go to {title.toLowerCase()}</span>

        <Link
          to={link}
          className="flex items-center gap-1 text-primary font-medium hover:underline"
        >
          Open <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
