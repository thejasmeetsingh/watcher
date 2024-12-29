import React from "react";
import { LogOut, X } from "lucide-react";

export default function LogoutModal({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="relative bg-gray-900/95 rounded-2xl border border-gray-800/50 shadow-2xl p-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
          <div className="absolute -left-20 -top-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
              <LogOut className="h-8 w-8 text-yellow-500" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Ready to Leave?
            </h3>

            <p className="text-gray-300 mb-6">
              Are you sure you want to log out of your account?
            </p>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>

              <button
                onClick={onLogout}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium
                  hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
