import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-red-200 bg-red-900/50 border border-red-500/50 rounded-lg animate-fadeIn">
      <AlertCircle className="h-4 w-4 text-red-400" />
      <span className="flex-1">{message}</span>
    </div>
  );
}
