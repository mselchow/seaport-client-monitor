import { Input, Button } from "@material-tailwind/react";

const SettingsPage = () => {
    return (
        <div className="flex place-items-center gap-4">
            <div className="w-96">
                <Input label="Clockify API Key" />
            </div>
            <Button>Save</Button>
        </div>
    );
};

export default SettingsPage;
