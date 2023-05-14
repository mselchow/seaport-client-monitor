"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ title, path }) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(path);

    return (
        <Link href={path} className={isActive ? "font-bold" : ""}>
            {title}
        </Link>
    );
}
