import localFont from "next/font/local";

export const bG = localFont({
  src: [
    {
      path: "/BricolageGrotesque.ttf",
      weight: "400",
    },
    {
      path: "/BricolageGrotesque.ttf",
      weight: "700",
    },
  ],
  variable: "--font-BricolageGrotesque",
});
