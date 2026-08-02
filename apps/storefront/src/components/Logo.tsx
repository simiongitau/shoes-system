import React from "react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-0.5 select-none"
      aria-label="Renewed Enchantment home"
    >
      <span className="text-[22px] font-extrabold tracking-tight text-[#FF7A1A] font-[Poppins,sans-serif]">
        Renewed
      </span>
      <span className="text-[22px] font-extrabold tracking-tight text-[#1C1B1F] font-[Poppins,sans-serif]">
        Enchantment
      </span>
    </Link>
  );
}
