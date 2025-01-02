import { AlertCircle, X } from "lucide-react";

export default function GlobalError({ message, onClose }) {
  return (
    <div className="fixed top-28 right-4 left-4 sm:left-auto sm:w-96 animate-[fadeIn_0.3s_ease-in-out] transition-all duration-300 opacity-100">
      <div className="flex items-start gap-2 p-4 text-red-200 bg-red-900/90 border border-red-500/50 rounded-xl backdrop-blur-sm shadow-lg">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium mb-1">Error</h4>
          <p className="text-sm text-red-200/90">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-200/80 hover:text-red-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
