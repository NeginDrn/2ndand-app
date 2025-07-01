// src/components/ButtonLink.tsx

import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
};

export default function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className="px-8 py-4 lg:px-10 lg:py-5 rounded-lg border border-[#D8E5C1] bg-[#FCFDE3] text-green-800 text-lg lg:text-xl font-bold hover:bg-[#f4f8d4] transition text-center"
    >
      {children}
    </Link>
  );
}
