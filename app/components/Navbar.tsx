// "use client";
// import Link from "next/link";
// import { forwardRef } from "react";

// const Navbar = forwardRef<HTMLDivElement>((props, logoRef) => {
//   return (
//     <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center">
//       <div
//         className="flex items-center justify-between
//                    w-[90%] max-w-sm
//                    px-10 py-3
//                    rounded-full
//                    border border-white/20
//                    bg-white/10 backdrop-blur-md
//                    shadow-lg"
//       >
//         {/* Logo */}
//         <div ref={logoRef} className="flex items-center gap-1">
//           <span className="text-white font-light text-sm">J</span>
//           <span className="w-2 h-2 bg-white rounded-full"></span>
//         </div>

//         <div className="flex gap-8 text-sm">
//           <Link
//             href="#about"
//             className="text-white/70 hover:text-white transition"
//           >
//             About
//           </Link>
//           <Link
//             href="#contact"
//             className="text-white/70 hover:text-white transition"
//           >
//             Contact
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// });

// Navbar.displayName = "Navbar";
// export default Navbar;

"use client";
import Link from "next/link";
import { forwardRef, useEffect, useState } from "react";
import gsap from "gsap";

interface NavbarProps {
  animateLogo?: boolean;
}

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ animateLogo }, logoRef) => {
    const [charIndex, setCharIndex] = useState(0);
    const fullText = "ulia";

    // useEffect(() => {
    //   if (!animateLogo) return;

    //   let index = 0;

    //   const interval = setInterval(() => {
    //     if (index < fullName.length) {
    //       setTyped((prev) => prev + fullName[index]);
    //       index++;
    //     } else {
    //       clearInterval(interval);

    //       gsap.to(".logo-dot", {
    //         backgroundColor: "#ec4899",
    //         scale: 1.4,
    //         duration: 0.3,
    //         yoyo: true,
    //         repeat: 1,
    //       });
    //     }
    //   }, 80);

    //   return () => clearInterval(interval);
    // }, [animateLogo]);
    useEffect(() => {
      if (!animateLogo) return;

      const interval = setInterval(() => {
        setCharIndex((prev) => {
          if (prev >= fullText.length) {
            clearInterval(interval);

            // 🔥 Ping dot pink when finished
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

    return (
      <nav className=" fixed top-6 left-0 right-0 z-50 flex justify-center">
        <div
          className="nav-body flex items-center justify-between
                     w-[90%] max-w-sm
                     px-10 py-3
                     rounded-full
                     border border-white/20
                     bg-white/10 backdrop-blur-md
                     shadow-lg"
        >
          <div ref={logoRef} className="flex items-center gap-1">
            <span className="text-white font-light text-sm">
              J{fullText.slice(0, charIndex)}
            </span>

            <span className="logo-dot w-2 h-2 bg-white rounded-full" />
          </div>

          <div className="flex gap-8 text-sm">
            <Link
              href="#about"
              className="text-white/70 hover:text-white transition"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-white/70 hover:text-white transition"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";
export default Navbar;
