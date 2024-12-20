export default function ({ icon: Icon, label, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        isActive
          ? "bg-white text-gray-900 border-white hover:bg-gray-100"
          : "border-gray-600 hover:border-white"
      }`}
    >
      <Icon
        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
          isActive ? "fill-current" : ""
        }`}
      />
      <span>{label}</span>
    </button>
  );
}
