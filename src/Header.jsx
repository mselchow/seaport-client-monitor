import { UserButton } from "@clerk/clerk-react";

const Header = () => {
    return (
        <div className="container mx-auto p-3">
            <div className="mb-3 flex place-content-between border-b-2 pb-1">
                <div className="text-2xl">Client Monitor</div>
                <UserButton showName="true" />
            </div>
        </div>
    );
};

export default Header;
