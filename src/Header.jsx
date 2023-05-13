import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import seaportLogo from "./assets/seaport-logo.png";

const Header = () => {
    return (
        <div className="flex place-content-between items-center border-b p-4">
            <div className="flex">
                <img
                    src={seaportLogo}
                    className="mr-3 h-6 sm:h-9"
                    alt="Seaport Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold">
                    Client Monitor
                </span>
            </div>

            <div className="flex gap-12">
                <div>
                    <NavLink
                        to="/charts"
                        className={({ isActive }) =>
                            isActive ? "font-bold" : ""
                        }
                    >
                        Charts
                    </NavLink>
                </div>
                <div>
                    <NavLink
                        to="/tables"
                        className={({ isActive }) =>
                            isActive ? "font-bold" : ""
                        }
                    >
                        Tables
                    </NavLink>
                </div>
                <div>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            isActive ? "font-bold" : ""
                        }
                    >
                        Settings
                    </NavLink>
                </div>
            </div>

            <div className="flex">
                <UserButton showName="true" />
            </div>
        </div>
    );
};

export default Header;
