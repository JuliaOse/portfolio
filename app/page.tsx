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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const aboutTextRef = useRef<HTMLParagraphElement | null>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const rotatingWordRef = useRef<HTMLSpanElement | null>(null);

  const contactRef = useRef<HTMLElement | null>(null);
  const contactTitleRef = useRef<HTMLHeadingElement | null>(null);
  const contactCardsRef = useRef<HTMLDivElement | null>(null);

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

  // Lock scroll while typewriter is running, release when done
  useEffect(() => {
    if (isTypingDone) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isTypingDone]);

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
      // const tl = gsap.timeline({
      //   scrollTrigger: {
      //     trigger: sectionRef.current,
      //     start: "top top",
      //     end: "+=2000", // 👈 shorter scroll distance = faster animation
      //     scrub: 1, // slight smoothing, not floaty
      //     pin: true,
      //   },
      // });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=4000",
          scrub: 2,
          pin: true,
          // ✅ Snap to next section after pin completes
          // snap: {
          //   snapTo: (value) => (value > 0.99 ? 1 : 0), // snap to start or end only
          //   duration: 0.5,
          //   ease: "power2.inOut",
          // },
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

      // tl.to(
      //   videoRef.current,
      //   {
      //     yPercent: -20, // moves slower than scroll
      //     ease: "none",
      //     duration: 3,
      //   },
      //   0,
      // );

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
        //opacity: 0.5,
        // onComplete: () => {
        //   //setTriggerNavAnimation(true);

        //   gsap.to(nameRef.current, {
        //     opacity: 0,
        //     //duration: 0.0,
        //     //delay: 0.2,
        //   });
        // },
      });
      tl.to(
        nameRef.current,
        {
          opacity: 0,
          duration: 0.1,
        },
        "-=0.3",
      ); //

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

  useEffect(() => {
    if (!isTypingDone && !triggerNavAnimation) return;

    const sections = gsap.utils.toArray<HTMLElement>("section");

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: (progress) => {
          const snapPoints = sections.map(
            (section) =>
              section.offsetTop /
              (document.body.scrollHeight - window.innerHeight),
          );

          return gsap.utils.snap(snapPoints, progress);
        },
        duration: 0.6,
        ease: "power2.inOut",
      },
    });

    ScrollTrigger.create({
      trigger: "#about",
      start: "top 80px", // when about reaches navbar area
      toggleClass: {
        targets: ".nav-body",
        className: "nav-light",
      },
    });
    ScrollTrigger.create({
      trigger: "#contact",
      start: "top 80px",
      toggleClass: {
        targets: ".nav-body",
        className: "nav-light",
      },
    });
  }, [isTypingDone, triggerNavAnimation]);

  useEffect(() => {
    if (!isTypingDone) return;
    if (!triggerNavAnimation) return;
    if (!aboutRef.current || !aboutTextRef.current || !aboutTitleRef.current)
      return;

    const ctx = gsap.context(() => {
      // ---- Title slides up ----
      // gsap.fromTo(
      //   aboutTitleRef.current,
      //   {
      //     y: 60,
      //     opacity: 0,
      //   },
      //   {
      //     y: 0,
      //     opacity: 1,
      //     duration: 0.8,
      //     ease: "power3.out",
      //     scrollTrigger: {
      //       trigger: aboutRef.current,
      //       start: "top 70%",
      //       toggleActions: "play none none none", // 🔥 no reverse
      //       once: true, // optional but cleaner
      //     },
      //   },
      // );

      const staticText = aboutTextRef.current.innerText;

      aboutTextRef.current.innerHTML = staticText
        .split(" ")
        .map((word) => `<span class="word inline-block mr-2">${word}</span>`)
        .join("");

      const words = [
        "software engineer",
        "creative",
        "frontend developer",
        "problem solver",
      ];

      let index = 0;

      // Set first rotating word
      rotatingWordRef.current.textContent = words[0];

      // Create ONE timeline for intro
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
          once: true,
        },
      });

      // Animate "I am a"
      introTl.from(aboutTextRef.current.querySelectorAll(".word"), {
        y: -60,
        rotation: "random(-80, 80)",
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "back.out(1.7)",
      });

      // 🔥 Animate first rotating word the SAME WAY
      introTl.from(
        rotatingWordRef.current,
        {
          y: -60,
          rotation: "random(-80, 80)",
          opacity: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
        },
        "-=0.8", // overlaps slightly for smoothness
      );

      // After intro finishes + 3 seconds → start loop
      introTl.call(() => {
        gsap.delayedCall(1.2, () => {
          const rotateTl = gsap.timeline({ repeat: -1 });

          rotateTl
            .to(rotatingWordRef.current, {
              rotationX: 90,
              opacity: 0,
              duration: 1.3,
              ease: "power2.in",
              transformOrigin: "center bottom",
              onComplete: () => {
                index = (index + 1) % words.length;
                rotatingWordRef.current!.textContent = words[index];
              },
            })
            .to(rotatingWordRef.current, {
              rotationX: 0,
              opacity: 1,
              duration: 1.3,
              ease: "power2.out",
              transformOrigin: "center top",
            });
        });
      });
      return () => ctx.revert();
    });
  }, [isTypingDone, triggerNavAnimation]);

  useEffect(() => {
    if (!isTypingDone || !triggerNavAnimation) return;
    if (!contactRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        contactTitleRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );

      // Cards stagger
      gsap.fromTo(
        contactCardsRef.current?.querySelectorAll(".contact-card"),
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }, contactRef);

    return () => ctx.revert();
  }, [isTypingDone, triggerNavAnimation]);

  const typedFirst = fullText.slice(0, charIndex).slice(0, firstText.length);
  const typedSecond =
    charIndex > firstText.length
      ? fullText.slice(firstText.length, charIndex)
      : "";

  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>
      <Navbar ref={logoRef} animateLogo={triggerNavAnimation} />
      <section
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video> */}

        <div
          className="relative z-10 flex flex-col h-full items-center 
                justify-end md:justify-end 
                text-white 
                pb-12 sm:pb-16 md:pb-20 px-4"
        >
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
      </section>

      <section
        id="about"
        ref={aboutRef}
        className="relative h-screen  w-full flex items-center justify-center 
        "
      >
        {/* Background panel */}
        <div
          className="absolute inset-y-0 left-2 right-2  md:left-6 md:right-6
                  bg-white rounded-t-[60px] overflow-hidden"
        >
          {/* Pink layer */}
          <div className="absolute inset-0 bg-pink-200 opacity-40" />
        </div>

        {/* Content */}
        <div className="relative z-10 gap-6 flex flex-col items-center justify-center min-h-screen">
          <h2
            ref={aboutTitleRef}
            className="text-6xl font-semibold text-pink-600"
          >
            About Me
          </h2>
          <p className="text-5xl text-pink-500  ">
            <span ref={aboutTextRef} className="text-center">
              I am a&nbsp;
            </span>
            <span
              ref={rotatingWordRef}
              className="inline-block perspective-1000 w-[450px] "
            />
          </p>
        </div>
      </section>

      <section
        id="contact"
        // ref={contactRef}  ← uncomment when using in Home component
        className="relative h-screen w-full flex items-center justify-center"
      >
        {/* Background panel — same rounded style as about */}
        <div
          className="absolute inset-y-0 left-2 right-2 md:left-6 md:right-6
                   bg-white rounded-b-[60px] overflow-hidden"
        >
          {/* Warm rose layer to differentiate from about's pink */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(251,207,232,0.4) 0%, rgba(254,228,230,0.55) 50%, rgba(255,241,242,0.6) 100%)",
            }}
          />
          {/* Soft radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 60% 40%, rgba(251,207,232,0.35) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-10 px-6 w-full max-w-3xl">
          {/* Title */}
          <h2
            // ref={contactTitleRef}  ← uncomment in Home
            className="text-6xl font-semibold text-pink-600"
          >
            Get in Touch
          </h2>

          <p className="text-pink-400 text-xl text-center max-w-md">
            Whether it's a project, a question, or just a hello, my inbox is
            always open.
          </p>

          {/* Cards */}
          <div
            // ref={contactCardsRef}  ← uncomment in Home
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
          >
            {/* Email */}
            <a
              href="mailto:julia@example.com"
              className="contact-card group flex flex-col items-center gap-3 
                       bg-white/60 backdrop-blur-sm border border-pink-100 
                       rounded-3xl p-8 
                       hover:bg-white/90 hover:shadow-xl hover:shadow-pink-100 
                       hover:-translate-y-1
                       transition-all duration-300 cursor-pointer"
            >
              <span className="text-3xl">✉️</span>
              <span className="text-pink-600 font-semibold text-sm tracking-wide uppercase">
                Email
              </span>
              <span className="text-pink-400 text-xs">julia@example.com</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/julia"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group flex flex-col items-center gap-3 
                       bg-white/60 backdrop-blur-sm border border-pink-100 
                       rounded-3xl p-8 
                       hover:bg-white/90 hover:shadow-xl hover:shadow-pink-100 
                       hover:-translate-y-1
                       transition-all duration-300 cursor-pointer"
            >
              <span className="text-3xl">💼</span>
              <span className="text-pink-600 font-semibold text-sm tracking-wide uppercase">
                LinkedIn
              </span>
              <span className="text-pink-400 text-xs">in/julia</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/julia"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group flex flex-col items-center gap-3 
                       bg-white/60 backdrop-blur-sm border border-pink-100 
                       rounded-3xl p-8 
                       hover:bg-white/90 hover:shadow-xl hover:shadow-pink-100 
                       hover:-translate-y-1
                       transition-all duration-300 cursor-pointer"
            >
              <span className="text-3xl">🐙</span>
              <span className="text-pink-600 font-semibold text-sm tracking-wide uppercase">
                GitHub
              </span>
              <span className="text-pink-400 text-xs">github.com/julia</span>
            </a>
          </div>

          {/* Subtle footer note */}
        </div>
      </section>
      <footer>
        <p className="text-pink-300 text-sm mt-4">
          Made with <span className="text-pink-400">♡</span> by Julia
        </p>
      </footer>
    </>
  );
}
