"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loading() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".loader-dot", {
      scale: 0,
      opacity: 0,
      stagger: 0.15,
      duration: 0.4,
      ease: "back.out(2)",
    });

    gsap.to(".loader-dot", {
      y: -10,
      stagger: 0.15,
      duration: 0.4,
      ease: "power2.out",
      yoyo: true,
      repeat: -1,
      delay: 0.6,
    });
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <p className="text-white/60 text-sm font-light tracking-widest uppercase font-gr">
        Loading
      </p>

      <div className="flex gap-3">
        <span className="loader-dot w-3 h-3 rounded-full bg-pink-400 block" />
        <span className="loader-dot w-3 h-3 rounded-full bg-pink-300 block" />
        <span className="loader-dot w-3 h-3 rounded-full bg-pink-200 block" />
      </div>
    </div>
  );
}
