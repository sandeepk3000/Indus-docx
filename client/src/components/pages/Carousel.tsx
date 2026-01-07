import { useEffect, useRef } from "react";

const items = ["HTML", "CSS", "JavaScript", "React", "Node", "MongoDB"];

export default function RingCarousel() {
  const trackRef = useRef(null);

  useEffect(() => {
    let x = 0;
    const speed = 0.6; // only forward

    const loop = () => {
      if (!trackRef.current) return;

      x -= speed;

      const width = trackRef.current.scrollWidth / 2;

      // 🔁 Ring reset (no oscillation)
      if (Math.abs(x) >= width) {
        x = 0;
      }

      trackRef.current.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gray-100 py-6">
      <div
        ref={trackRef}
        className="flex w-max gap-6 will-change-transform"
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="min-w-[160px] rounded-2xl bg-black px-6 py-4 text-center text-white text-lg"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
