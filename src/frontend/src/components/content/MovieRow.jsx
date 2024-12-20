import { useRef, useState } from "react";
import ScrollProgressbar from "../ScrollProgressbar";

export default function ({ title, items, Card }) {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      const scrollWidth = element.scrollWidth - element.clientWidth;
      const scrolled = element.scrollLeft;
      const progress = (scrolled / scrollWidth) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <div className="mx-4 p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <ScrollProgressbar progress={scrollProgress} />
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 hide-scrollbar"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {items.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
