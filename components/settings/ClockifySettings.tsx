"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import SettingsPage from "@/components/settings/SettingsPage";
import WelcomeCard from "@/components/WelcomeCard";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Loader2 } from "lucide-react";

interface FormValues {
    clockifyKey: string;
}

// form schema/validation
const formSchema = z.object({
    clockifyKey: z.string().min(45, {
        message: "Please enter a full Clockify API key before saving.",
    }),
});

const ClockifySettings = () => {
    const queryClient = useQueryClient();
    const { user, isLoaded } = useUser();
    const [formPending, setFormPending] = useState(false);
    const { toast } = useToast();

    const userHasClockifyKey =
        isLoaded && user
            ? (user.publicMetadata.hasClockifyKey as boolean)
            : false;

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

        // if save was successful, invalidate Clockify data query to refetch
        if (result) {
            form.reset();
            toast({
                title: "Success!",
                description: "Clockify API key saved.",
                duration: 5000,
                variant: "primary",
            });
            if (user) {
                user.reload();
            }
            queryClient.invalidateQueries(["clockify"]);
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
        <SettingsPage
            title="Clockify Settings"
            description="Save or update your Clockify API key to connect to your Clockify data."
        >
            {isLoaded && !userHasClockifyKey && <WelcomeCard />}

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
                <div>
                    {!isLoaded
                        ? "Loading Clockify key status..."
                        : userHasClockifyKey
                        ? "Clockify API key securely stored."
                        : "No Clockify API key found."}
                </div>
            </div>
        </SettingsPage>
    );
};

export default ClockifySettings;
