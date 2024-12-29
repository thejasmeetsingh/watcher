import { Loader2 } from "lucide-react";

export default function Loader({ size }) {
  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="relative">
        <Loader2
          size={size ? size : 24}
          className="absolute w-full animate-spin text-gray-500"
        />
      </div>
    </div>
  );
}
