"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavLinkProps {
    title: string;
    path: string;
}

export default function NavLink({ title, path }: NavLinkProps) {
    const router = useRouter();
    const pathname = router.asPath;
    let isActive = false;

    if (path.startsWith("/settings")) {
        isActive = pathname.startsWith("/settings");
    } else {
        isActive = pathname === path;
    }

    const highlightActive = isActive ? "bg-secondary" : "";
    const boldActive = isActive ? "font-bold" : "font-normal";

    return (
        <Button variant="ghost" className="lg:w-28 xl:w-36" asChild>
            <Link href={path} className={cn(boldActive, highlightActive)}>
                {title}
            </Link>
        </Button>
    );
}
