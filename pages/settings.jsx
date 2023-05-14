import Head from "next/head";
import { Input, Button } from "@material-tailwind/react";

const Settings = () => {
    return (
        <>
            <Head>
                <title>Settings | Seaport Client Monitor</title>
            </Head>
            <div className="flex place-items-center gap-4">
                <div className="w-96">
                    <Input label="Clockify API Key" />
                </div>
                <Button>Save</Button>
            </div>
        </>
    );
};

export default Settings;
