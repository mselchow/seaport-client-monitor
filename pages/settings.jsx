"use client";

import { useState } from "react";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { Input, Button, Typography, Spinner } from "@material-tailwind/react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

const Settings = () => {
    const { user, isLoaded } = useUser();
    const [key, setKey] = useState("");
    const [formPending, setFormPending] = useState(false);
    const onChange = ({ target }) => setKey(target.value);
    let apiKeyMessage;

    const userHasClockifyKey = isLoaded
        ? user.publicMetadata.hasClockifyKey
        : false;

    if (!isLoaded) {
        apiKeyMessage = "Loading Clockify key status...";
    } else {
        apiKeyMessage = userHasClockifyKey
            ? "Clockify API key securely stored."
            : "No Clockify API key found.";
    }

    const handleSubmit = async (event) => {
        // set state for pending indicator
        setFormPending(true);

        // prevent form from submitting and refreshing the page
        event.preventDefault();

        // get the data from the form
        const data = {
            clockifyKey: event.target.clockifyKey.value,
        };

        // format data as JSON to send to server
        const JSONdata = JSON.stringify(data);

        // create request to send to server
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONdata,
        };

        // send form data to API endpoint and await response
        const response = await fetch("/api/saveClockifyKey", options);
        // eslint-disable-next-line no-unused-vars
        const result = await response.json();

        setFormPending(false);
        setKey("");
    };

    return (
        <div className="lg:place-items-left flex w-full flex-col gap-3 lg:w-fit">
            <>
                <Head>
                    <title>Settings | Seaport Client Monitor</title>
                </Head>
                <Typography variant="h4">User Settings</Typography>
                <form onSubmit={handleSubmit}>
                    <div className="flex place-items-center gap-4">
                        <div className="flex-1 lg:w-96 lg:flex-none">
                            <Input
                                label="Clockify API Key"
                                id="clockifyKey"
                                onChange={onChange}
                                value={key}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!key || formPending}
                            color={key ? "blue" : "blue-gray"}
                            className="w-24"
                        >
                            {formPending ? (
                                <Spinner
                                    className="inline h-4 w-4"
                                    color="white"
                                />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </form>

                <div className="flex items-center gap-2 text-sm text-blue-gray-700">
                    <div className="w-6">
                        {!isLoaded ? (
                            <Spinner />
                        ) : userHasClockifyKey ? (
                            <LockClosedIcon className="h-6 w-6" />
                        ) : (
                            <LockOpenIcon className="h-6 w-6" />
                        )}
                    </div>

                    <div>{apiKeyMessage}</div>
                </div>
            </>
        </div>
    );
};

export default Settings;
