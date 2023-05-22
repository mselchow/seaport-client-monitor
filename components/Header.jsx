import { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/clerk-react";
import {
    Navbar,
    Collapse,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import NavLink from "./NavLink";

const navLinks = [
    { title: "Charts", path: "/charts" },
    { title: "Tables", path: "/tables" },
    { title: "Settings", path: "/settings" },
];

const Header = () => {
    const [openNav, setOpenNav] = useState(false);

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false)
        );
    }, []);

    const navList = (
        <div className="mb-4 mt-6 flex flex-col gap-4 text-blue-gray-900 lg:mb-0 lg:mt-0 lg:flex-row lg:gap-4">
            {navLinks.map(({ title, path }) => (
                <NavLink key={title} title={title} path={path} />
            ))}
        </div>
    );

    return (
        <>
            <Navbar className="sticky inset-0 z-10 h-max max-w-full rounded-none px-4 py-3 pb-2 lg:px-8 lg:py-4">
                <div className="grid grid-cols-2 items-center text-blue-gray-900 lg:grid-cols-3">
                    <div className="flex">
                        <Image
                            src="/seaport-logo.png"
                            alt="Seaport Logo"
                            className="mr-3 h-9"
                            height="36"
                            width="36"
                        />
                        <Typography
                            variant="h5"
                            className="self-center whitespace-nowrap"
                        >
                            Client Monitor
                        </Typography>
                    </div>

                    <div className="hidden lg:block lg:justify-self-center">
                        {navList}
                    </div>

                    <div className="hidden lg:inline-block lg:justify-self-end">
                        <ClerkLoading></ClerkLoading>
                        <ClerkLoaded>
                            <UserButton showName="true" />
                        </ClerkLoaded>
                    </div>

                    <IconButton
                        variant="text"
                        className=" h-6 w-6 justify-self-end text-inherit hover:bg-transparent focus:bg-transparent lg:hidden"
                        ripple={false}
                        onClick={() => setOpenNav(!openNav)}
                    >
                        {openNav ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </IconButton>
                </div>

                <Collapse open={openNav} className="px-2">
                    {navList}
                    <hr className="my-2 border-blue-gray-50" />
                    <div className="py-3">
                        <ClerkLoading></ClerkLoading>
                        <ClerkLoaded>
                            <UserButton
                                showName="true"
                                appearance={{
                                    elements: {
                                        userButtonBox: "flex-row-reverse",
                                        userButtonOuterIdentifier: "text-base",
                                        avatarBox: "w-7 h-7",
                                    },
                                }}
                            />
                        </ClerkLoaded>
                    </div>
                </Collapse>
            </Navbar>
        </>

        // <div className="grid grid-cols-3 items-center border-b p-4">
        //     <div className="flex">
        //         <Image
        //             src="/seaport-logo.png"
        //             alt="Seaport Logo"
        //             className="mr-3 h-9"
        //             height="36"
        //             width="36"
        //         />
        //         <span className="self-center whitespace-nowrap text-xl font-semibold">
        //             Client Monitor
        //         </span>
        //     </div>

        //     {navList}

        // <div className="flex justify-self-end">
        //     <ClerkLoading></ClerkLoading>
        //     <ClerkLoaded>
        //         <UserButton showName="true" />
        //     </ClerkLoaded>
        // </div>
        // </div>
    );
};

export default Header;
