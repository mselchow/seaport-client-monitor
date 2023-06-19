"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import Head from "next/head";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Lock, Unlock } from "lucide-react";

import ExcludedClientSettings from "@/components/ExcludedClientSettings";

interface FormValues {
    clockifyKey: string;
}

// form schema/validation
const formSchema = z.object({
    clockifyKey: z.string().min(45, {
        message: "Please enter a full Clockify API key before saving.",
    }),
});

const Settings = () => {
    const queryClient = useQueryClient();
    const { user, isLoaded } = useUser();
    const [formPending, setFormPending] = useState(false);
    const { toast } = useToast();
    let apiKeyMessage;

    const userHasClockifyKey =
        isLoaded && user ? user.publicMetadata.hasClockifyKey : false;

    if (!isLoaded) {
        apiKeyMessage = "Loading Clockify key status...";
    } else {
        apiKeyMessage = userHasClockifyKey
            ? "Clockify API key securely stored."
            : "No Clockify API key found.";
    }

    // form definition
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clockifyKey: "",
        },
    });

    // form submission handler
    async function onSubmit(data: FormValues) {
        setFormPending(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clockifyKey: data.clockifyKey,
            }),
        };
        const response = await fetch("/api/saveClockifyKey", options);
        const result = await response.json();

        // if save was successful, invalidate "clockifyData" query to refetch
        if (result) {
            form.reset();
            toast({
                title: "Success!",
                description: "Clockify API key saved.",
                duration: 5000,
                variant: "primary",
            });
            queryClient.invalidateQueries(["clockifyData"]);
        } else {
            toast({
                title: "Error!",
                description: "Unable to save your Clockify key.",
                duration: 5000,
                variant: "destructive",
            });
        }

        setFormPending(false);
    }

    return (
        <>
            <Head>
                <title>Settings | Seaport Client Monitor</title>
            </Head>
            <div className="lg:place-items-left flex w-full flex-col gap-3 lg:px-[10%] xl:px-[15%]">
                <TypographyH3>Settings</TypographyH3>
                <Card className="mb-3">
                    <CardHeader>
                        <CardTitle>Clockify</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="flex-start flex gap-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="clockifyKey"
                                        render={({ field }) => (
                                            <FormItem className="w-full lg:w-[425px]">
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Clockify API Key"
                                                        id="clockifyKey"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={formPending}
                                        className="w-24"
                                    >
                                        {formPending ? (
                                            <Loader2 className="inline h-4 w-4 animate-spin" />
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </form>
                            </Form>

                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <div className="w-6">
                                    {!isLoaded ? (
                                        <Loader2 className="animate-spin" />
                                    ) : userHasClockifyKey ? (
                                        <Lock className="h-6 w-6" />
                                    ) : (
                                        <Unlock className="h-6 w-6" />
                                    )}
                                </div>
                                <div>{apiKeyMessage}</div>
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
