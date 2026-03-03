"use client";
import { forwardRef, useEffect, useState } from "react";
import gsap from "gsap";

interface NavbarProps {
  animateLogo?: boolean;
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ animateLogo }, logoRef) => {
    const [charIndex, setCharIndex] = useState(0);
    const fullText = "ulia";

    useEffect(() => {
      if (!animateLogo) return;

      const interval = setInterval(() => {
        setCharIndex((prev) => {
          if (prev >= fullText.length) {
            clearInterval(interval);

            gsap.to(".logo-dot", {
              backgroundColor: "#ec4899",
              scale: 1.1,
              duration: 0.3,
              yoyo: true,
            });

            const tl = gsap.timeline();
            tl.to(".nav-body", {
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255,255,255,0.4)",
              duration: 0.6,
              ease: "power2.out",
            });
            tl.to(".nav-body", {
              scale: 1,
              boxShadow: "0 0 0px rgba(255,255,255,0)",
              duration: 0.15,
              ease: "power2.inOut",
            });

            return prev;
          }
          return prev + 1;
        });
      }, 80);

      return () => clearInterval(interval);
    }, [animateLogo]);

    const scrollTo = (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const reloadPage = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <div
          className="nav-body flex items-center justify-between
         w-[92%] max-w-sm
         px-6 py-3
         rounded-full
         border border-white/20
         bg-white/10 backdrop-blur-md
         shadow-lg
         transition-all duration-300"
        >
          <button
            onClick={reloadPage}
            className="flex items-center gap-1 cursor-pointer"
          >
            <div ref={logoRef} className="flex items-center gap-1">
              <span className="nav-text text-white font-light text-sm">
                J{fullText.slice(0, charIndex)}
              </span>
              <span className="logo-dot w-2 h-2 bg-white rounded-full" />
            </div>
          </button>

          <div className="flex gap-6 text-sm">
            <button
              onClick={() => scrollTo("about")}
              className="nav-text text-white font-light text-sm hover:text-white/70 transition cursor-pointer"
            >
              <span className="nav-text">About</span>
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="nav-text text-white font-light text-sm hover:text-white/70 transition cursor-pointer"
            >
              <span className="nav-text">Contact</span>
            </button>
          </div>
        </div>
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";
export default Navbar;
