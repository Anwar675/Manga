"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const Page = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(true);
    }, 3000); // 3 giây

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`text-center w-full py-34 flex justify-center items-center gap-30 text-2xl font-bold md:flex-row flex-col transition-colors duration-1000 ${
        active ? "bg-black" : "bg-white"
      }`}
    >
      <Image
        src="/img/skeleton.jpg"
        width={120}
        height={100}
        alt="skeleton"
        className={`transition-transform duration-1000 ${
          active ? "scale-150" : "scale-100"
        }`}
      />

      <p className="glow-text">We are going to develop in the future</p>

      <Image
        src="/img/skeleton2.jpg"
        width={120}
        height={100}
        alt="skeleton"
        className={`transition-transform duration-1000 ${
          active ? "scale-150" : "scale-100"
        }`}
      />
    </div>
  );
};

export default Page;