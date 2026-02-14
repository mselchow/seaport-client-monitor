import { GithubIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6 place-self-end border-t py-3 text-center">
            <ul className="flex flex-wrap items-center gap-10">
                <li>
                    <Button
                        variant="ghost"
                        aria-label="Link to GitHub repository"
                    >
                        <Link
                            href="https://github.com/mselchow/seaport-client-monitor"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <GithubIcon />
                        </Link>
                    </Button>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
