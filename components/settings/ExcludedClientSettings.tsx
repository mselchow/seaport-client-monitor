"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SettingsPage from "@/components/settings/SettingsPage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useClockifyData } from "@/lib/clockify";
import ClockifyProject, { ClockifyJSON } from "@/lib/clockifyProject";

const ExcludedClientSettings = () => {
    const { user, isLoaded } = useUser();
    const [formPending, setFormPending] = useState(false);
    const { toast } = useToast();

    // Get set of clients from Clockify data
    const result = useClockifyData();
    let clockifyData: ClockifyProject[], clientList: ClockifyProject[];
    const clientSet = new Set<string>();
    if (result.isError) {
        // We had an error, show error message below
    } else if (!result.isLoading) {
        clockifyData = result.data.map(
            (data: ClockifyJSON) => new ClockifyProject(data)
        );

        clientList = clockifyData.filter((proj) => {
            const duplicate = clientSet.has(proj.name);
            clientSet.add(proj.name);
            return !duplicate;
        });
    }

    // Set default to empty array to prevent iterable error
    const form = useForm({
        defaultValues: {
            excludedClients: [""],
        },
    });

    // Update form's default values when data loads from Clerk
    useEffect(() => {
        if (isLoaded && user) {
            form.setValue(
                "excludedClients",
                user.publicMetadata?.excludedClients as string[]
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    // Form submission handler
    async function onSubmit(data: unknown) {
        setFormPending(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        const response = await fetch("/api/saveExcludedClients", options);
        const result = await response.json();

        // confirm successful save to user
        if (result) {
            toast({
                title: "Success!",
                description: "Excluded client settings saved.",
                duration: 5000,
                variant: "primary",
            });
        }

        if (user) {
            user.reload();
        }
        setFormPending(false);
    }

    function handleUserKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter") {
            form.handleSubmit(onSubmit)();
        }
    }

    return (
        <SettingsPage
            title="Excluded Clients"
            description="Clients selected below will be excluded from any
                    charts/tables, but will still count towards hours logged
                    summaries on the dashboard."
        >
            <>
                {result.isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : result.isError ? (
                    <p>We encountered an error fetching Clockify data.</p>
                ) : (
                    <div className="">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <FormField
                                    control={form.control}
                                    name="excludedClients"
                                    render={() => (
                                        <FormItem>
                                            {clientList.map((client) => (
                                                <FormField
                                                    key={client.clientId}
                                                    control={form.control}
                                                    name="excludedClients"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={
                                                                    client.clientId
                                                                }
                                                                className="flex items-center gap-2 space-y-0 rounded-md px-2 py-1 hover:bg-muted"
                                                                onKeyDown={
                                                                    handleUserKeyPress
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(
                                                                            client.clientId
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            return checked
                                                                                ? field.onChange(
                                                                                      [
                                                                                          ...field.value,
                                                                                          client.clientId,
                                                                                      ]
                                                                                  )
                                                                                : field.onChange(
                                                                                      field.value?.filter(
                                                                                          (
                                                                                              value
                                                                                          ) =>
                                                                                              value !==
                                                                                              client.clientId
                                                                                      )
                                                                                  );
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-md w-full cursor-pointer font-normal text-primary">
                                                                    {
                                                                        client.name
                                                                    }
                                                                </FormLabel>
                                                            </FormItem>
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={formPending}
                                    className="mt-5 w-full md:w-48"
                                >
                                    {formPending ? (
                                        <Loader2 className="inline h-4 w-4 animate-spin" />
                                    ) : (
                                        "Save Excluded Clients"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                )}
            </>
        </SettingsPage>
    );
};

export default ExcludedClientSettings;
