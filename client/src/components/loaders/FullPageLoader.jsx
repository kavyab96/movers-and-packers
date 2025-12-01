import { Loader2 } from "lucide-react";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-3 text-white">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-lg font-medium">Processing...</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
