export default function GenreBanner({ genre }) {
  return (
    <div className="relative w-full h-[300px] overflow-hidden bg-gradient-to-t to-slate-500 from-transparent">
      <div className="relative w-full h-full">
        <div className="absolute w-full h-full opacity-100 translate-x-0 scale-100 z-10">
          <div
            className="absolute text-center bottom-0 left-0 right-0 p-12
              translate-y-0 opacity-100"
          >
            <h1 className="text-white text-7xl font-bold mb-4 translate-x-0 opacity-100">
              {genre}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
