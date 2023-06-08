import { useState } from "react";
import Image from "next/image";
import {
    UserButton,
    ClerkLoading,
    ClerkLoaded,
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
} from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";
import { TypographyH4 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";
import { cn } from "@/lib/utils";
import RefetchData from "@/components/RefetchData";
import { Separator } from "@/components/ui/separator";

const navLinks = [
    { title: "Dashboard", path: "/" },
    { title: "Hours Used", path: "/charts" },
    { title: "Hours Left", path: "/tables" },
    { title: "Settings", path: "/settings" },
];

const Header = () => {
    const [openNav, setOpenNav] = useState(false);

    const navList = (
        <div className="mb-3 mt-6 flex flex-col gap-4 text-primary lg:mb-0 lg:mt-0 lg:flex-row">
            {navLinks.map(({ title, path }) => (
                <NavLink key={title} title={title} path={path} />
            ))}
        </div>
    );

    const clerkLoginRegisterButtons = (
        <div className="mb-4 mt-6 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row">
            <SignInButton>
                <Button variant="outline" className="w-full lg:w-auto">
                    Log in
                </Button>
            </SignInButton>
            <SignUpButton>
                <Button className="w-full lg:w-auto">Register</Button>
            </SignUpButton>
        </div>
    );

    const clerkUserAvatar = (
        <div className="flex justify-center py-3 lg:flex-none lg:py-0">
            <ClerkLoading></ClerkLoading>
            <ClerkLoaded>
                <UserButton
                    showName="true"
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            userButtonBox: "flex-row-reverse lg:flex-row",
                            userButtonOuterIdentifier: "text-sm",
                            avatarBox: "w-7 h-7 lg:w-8 lg:h-8",
                        },
                    }}
                />
            </ClerkLoaded>
        </div>
    );

    return (
        <header className="sticky inset-0 z-10 h-max max-w-full rounded-none bg-background bg-opacity-80 px-4 py-3 shadow-md backdrop-blur-2xl lg:h-[72px] lg:px-8 lg:py-4">
            <div className="grid h-full grid-cols-2 items-center text-primary lg:grid-cols-3">
                <div className="flex">
                    <Image
                        src="/seaport-logo.png"
                        alt="Seaport Logo"
                        className="mr-3 h-9"
                        height="36"
                        width="36"
                    />
                    <TypographyH4 className="self-center">
                        Client Monitor
                    </TypographyH4>
                </div>

                <nav className="hidden lg:block lg:justify-self-center">
                    <SignedIn>{navList}</SignedIn>
                </nav>

                <div className="hidden lg:flex lg:h-2/3 lg:items-center lg:space-x-2 lg:justify-self-end">
                    <SignedIn>
                        <RefetchData
                            query={[
                                "clockifyData",
                                "clockifySummaryReport",
                                "clockifyWeeklyReport",
                            ]}
                        />
                        <Separator orientation="vertical" />
                        {clerkUserAvatar}
                    </SignedIn>
                    <SignedOut>{clerkLoginRegisterButtons}</SignedOut>
                </div>

                <div className="flex h-2/3 items-center gap-3 justify-self-end lg:hidden">
                    <SignedIn>
                        <RefetchData
                            query={[
                                "clockifyData",
                                "clockifySummaryReport",
                                "clockifyWeeklyReport",
                            ]}
                        />
                        <Separator orientation="vertical" />
                    </SignedIn>
                    <button
                        className="h-6 w-6 justify-self-end text-inherit hover:bg-transparent focus:bg-transparent"
                        aria-label={
                            openNav ? "Close the menu" : "Open the menu"
                        }
                        aria-expanded={openNav}
                        onClick={() => setOpenNav(!openNav)}
                    >
                        {openNav ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <div
                className={cn(
                    openNav ? "h-auto" : "invisible max-h-0",
                    "flex w-full  flex-col overflow-hidden lg:hidden"
                )}
            >
                <SignedIn>
                    {navList}
                    <hr className="my-1" />
                    {clerkUserAvatar}
                </SignedIn>
                <SignedOut>{clerkLoginRegisterButtons}</SignedOut>
            </div>
        </header>
    );
};

export default Header;
