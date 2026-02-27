"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Navbar from "../app/components/Navbar.tsx";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Home() {
  const firstText = "Hi! I'm ";
  const secondText = "Julia.";
  const fullText = firstText + secondText;

  const [charIndex, setCharIndex] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [triggerNavAnimation, setTriggerNavAnimation] = useState(false);

  const sectionRef = useRef(null);
  const hiRef = useRef(null);
  const nameRef = useRef(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= fullText.length) {
          clearInterval(interval);
          setIsTypingDone(true);
          return prev;
        }
        return prev + 1;
      });
    }, 80); // realistic typing speed

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (!isTypingDone) return;

  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: "top top",
  //         end: window.innerWidth < 768 ? "+=500" : "+=800",
  //         scrub: true,
  //         pin: true,
  //       },
  //     });

  //     const computeDockPosition = () => {
  //       if (!nameRef.current || !logoRef.current) return { x: 0, y: 0 };

  //       const nameRect = nameRef.current.getBoundingClientRect();
  //       const logoRect = logoRef.current.getBoundingClientRect();

  //       const x = logoRect.left - nameRect.left;
  //       const y = logoRect.top - nameRect.top;

  //       return { x, y };
  //     };

  //     // Fade out "Hi I'm"
  //     tl.to(
  //       hiRef.current,
  //       {
  //         opacity: 0,
  //         y: -40,
  //         ease: "none",
  //       },
  //       0,
  //     );

  //     // Move Julia into navbar
  //     tl.to(
  //       nameRef.current,
  //       {
  //         ...computeDockPosition(),
  //         scale: 0.4,
  //         ease: "none",
  //       },
  //       0,
  //     );
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, [isTypingDone]);

  // Split the typed text dynamically
  useEffect(() => {
    if (!isTypingDone) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=600", // 👈 shorter scroll distance = faster animation
          scrub: 1, // slight smoothing, not floaty
          pin: true,
        },
      });

      const computeCenterX = () => {
        if (!nameRef.current) return 0;

        const rect = nameRef.current.getBoundingClientRect();
        const viewportCenter = window.innerWidth / 2;
        const elementCenter = rect.left + rect.width / 2;

        return viewportCenter - elementCenter;
      };

      const computeDockPosition = () => {
        if (!nameRef.current || !logoRef.current) return { x: 0, y: 0 };

        const nameRect = nameRef.current.getBoundingClientRect();
        const logoRect = logoRef.current.getBoundingClientRect();

        const nameCenterY = nameRect.top + nameRect.height / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;

        const nameCenterX = nameRect.left + nameRect.width / 2;
        const logoCenterX = logoRect.left + logoRect.width / 2;

        return {
          x: logoCenterX - nameCenterX,
          y: logoCenterY - nameCenterY,
        };
      };

      // -------------------------
      // PHASE 1 — fade + center
      // -------------------------

      tl.to(
        hiRef.current,
        {
          opacity: 0,
          ease: "none",
          duration: 0.8,
        },
        0,
      );

      tl.to(
        nameRef.current,
        {
          x: computeCenterX,
          ease: "power2.out",
          duration: 0.8,
        },
        0,
      );

      // 🔥 SMALL PAUSE (no delay hack)
      tl.to(nameRef.current, { scale: 1.1, duration: 0.8 });

      // -------------------------
      // PHASE 2 — dock into navbar
      // -------------------------

      tl.to(nameRef.current, {
        ...computeDockPosition(),
        scale: 0.2,
        ease: "power2.inOut",
        duration: 2.3,
        onComplete: () => {
          //setTriggerNavAnimation(true);

          gsap.to(nameRef.current, {
            opacity: 0,
            duration: 0.4,
            //delay: 0.2,
          });
        },
      });

      tl.call(
        () => {
          setTriggerNavAnimation(true);
        },
        [],
        "-=0.6",
      );

      // tl.to(nameRef.current, {
      //   opacity: 0,
      //   duration: 1,
      // });
    }, sectionRef);

    return () => ctx.revert();
  }, [isTypingDone]);
  const typedFirst = fullText.slice(0, charIndex).slice(0, firstText.length);
  const typedSecond =
    charIndex > firstText.length
      ? fullText.slice(firstText.length, charIndex)
      : "";

  return (
    <main ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div
        className="relative z-10 flex flex-col h-full items-center 
                justify-end md:justify-end 
                text-white 
                pb-12 sm:pb-16 md:pb-20 px-4"
      >
        <Navbar ref={logoRef} animateLogo={triggerNavAnimation} />
        <Image
          src="/m1.png"
          width={310}
          height={310}
          alt="avatar"
          className="w-100 sm:w-52 md:w-64 lg:w-[370px] h-auto"
        />

        <h1 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-semibold tracking-tight mt-6">
          <span ref={hiRef} className="inline-block">
            {typedFirst}
          </span>{" "}
          <span ref={nameRef} className="inline-block">
            {typedSecond}
          </span>
          {!isTypingDone && (
            <span className="ml-2 animate-blink-horizontal">_</span>
          )}
        </h1>
      </div>
    </main>
  );
}
