import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";

export default function NotFound() {
    return (
        <div className="flex flex-col place-items-center justify-center gap-5">
            <TypographyH3>Where ya goin&apos;?</TypographyH3>
            <p>This page does not exist!</p>
            <Button className="lg:w-28 xl:w-36" asChild>
                <Link href="/">Home</Link>
            </Button>
        </div>
    );
}
