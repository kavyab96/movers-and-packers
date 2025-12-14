import { Button } from "@/components/ui/button";

const EmptyState = ({
  icon: Icon,
  title = "No data found",
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      {Icon && <Icon className="h-10 w-10 text-muted-foreground/60" />}
      
      <h3 className="text-sm font-medium">{title}</h3>

      {description && (
        <p className="text-xs text-muted-foreground max-w-sm">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
