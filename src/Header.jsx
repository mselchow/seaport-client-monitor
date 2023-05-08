import { UserButton } from "@clerk/clerk-react";
import { Navbar } from "flowbite-react";
import seaportLogo from "./assets/seaport-logo.png";

const Header = () => {
    return (
        <Navbar fluid={true} rounded={true}>
            <Navbar.Brand href="/">
                <img
                    src={seaportLogo}
                    className="mr-3 h-6 sm:h-9"
                    alt="Seaport Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    Client Monitor
                </span>
            </Navbar.Brand>
            <div className="flex items-center">
                <UserButton showName="true" />
            </div>
        </Navbar>
    );
};

export default Header;
