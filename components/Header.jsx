import Image from "next/image";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/clerk-react";
import NavLink from "./NavLink";

const navLinks = [
    { title: "Charts", path: "/charts" },
    { title: "Tables", path: "/tables" },
    { title: "Settings", path: "/settings" },
];

const Header = () => {
    return (
        <div className="grid grid-cols-3 items-center border-b p-4">
            {/* <div className="flex place-content-between items-center border-b p-4"> */}
            <div className="flex">
                <Image
                    src="/seaport-logo.png"
                    alt="Seaport Logo"
                    className="mr-3 h-9"
                    height="36"
                    width="36"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold">
                    Client Monitor
                </span>
            </div>

            <div className="flex gap-12 justify-self-center">
                {navLinks.map((link) => (
                    <div key={link.title}>
                        <NavLink title={link.title} path={link.path} />
                    </div>
                ))}
            </div>

            <div className="flex justify-self-end">
                <ClerkLoading></ClerkLoading>
                <ClerkLoaded>
                    <UserButton showName="true" />
                </ClerkLoaded>
            </div>
            {/* </div> */}
        </div>
    );
};

export default Header;
