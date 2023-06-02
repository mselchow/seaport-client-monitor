"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

import Head from "next/head";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";

import ExcludedClientSettings from "@/components/ExcludedClientSettings";

const Settings = () => {
    const queryClient = useQueryClient();
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

        // if save was successful, invalidate "clockifyData" query to refetch
        if (result) {
            queryClient.invalidateQueries(["clockifyData"]);
        }

        setFormPending(false);
        setKey("");
    };

    return (
        <>
            <Head>
                <title>Settings | Seaport Client Monitor</title>
            </Head>
            <div className="lg:place-items-left flex w-full flex-col gap-3 lg:w-fit xl:w-2/3">
                <TypographyH3>Settings</TypographyH3>
                <Card className="mb-3">
                    <CardHeader>
                        <CardTitle>Clockify</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <form onSubmit={handleSubmit}>
                                <div className="flex place-items-center gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Clockify API Key"
                                        id="clockifyKey"
                                        className="flex-1 lg:w-96 lg:flex-none"
                                        onChange={onChange}
                                        value={key}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!key || formPending}
                                        color={key ? "blue" : "blue-gray"}
                                        className="w-24"
                                    >
                                        {formPending ? (
                                            <Loader2 className="inline h-4 w-4 animate-spin" />
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>
                            </form>
                            <div className="flex items-center gap-2 text-sm text-blue-gray-700">
                                <div className="w-6">
                                    {!isLoaded ? (
                                        <Loader2 className="animate-spin" />
                                    ) : userHasClockifyKey ? (
                                        <LockClosedIcon className="h-6 w-6" />
                                    ) : (
                                        <LockOpenIcon className="h-6 w-6" />
                                    )}
                                </div>
                                <div className="text-foreground">
                                    {apiKeyMessage}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ExcludedClientSettings />
            </div>
        </>
    );
};

export default Settings;
