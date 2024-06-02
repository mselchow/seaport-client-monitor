"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

interface NavLinkProps {
    title: string;
    path: string;
}

export default function NavLink({ title, path }: NavLinkProps) {
    const pathname = usePathname();
    let isActive = false;

    if (pathname?.startsWith("/settings")) {
        isActive = true;
    } else {
        isActive = pathname === path;
    }

    const highlightActive = isActive ? "bg-secondary font-bold" : "font-normal";

    return (
        <Button variant="ghost" className="lg:w-28 xl:w-36" asChild>
            <Link href={path} className={highlightActive}>
                {title}
            </Link>
        </Button>
    );
}
