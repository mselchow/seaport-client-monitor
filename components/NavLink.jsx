"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "@material-tailwind/react";

export default function NavLink({ title, path }) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(path);

    const highlightActive = isActive ? "bg-blue-gray-100" : "";
    const boldActive = isActive ? "font-bold" : "";

    return (
        <Link href={path} className={boldActive}>
            <MenuItem className={`${highlightActive} lg:px-8`}>
                {title}
            </MenuItem>
        </Link>
    );
}
