import ErrorMessage from "./ErrorMessage";

export default function InputField({
  type,
  id,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-gray-800/50 border ${
          error ? "border-red-500" : "border-gray-600"
        } rounded-xl text-white placeholder-gray-400 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent
            transition-all duration-200`}
        placeholder={placeholder}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
