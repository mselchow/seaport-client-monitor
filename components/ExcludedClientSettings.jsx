"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useClockifyData } from "@/lib/useClockifyData";
import ClockifyProject from "@/lib/clockifyProject";

import {
    Card,
    CardBody,
    Typography,
    Spinner,
    Button,
} from "@material-tailwind/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormItem,
} from "@/components/ui/form";

const ExcludedClientSettings = () => {
    const queryClient = useQueryClient();
    const { user, isLoaded } = useUser();
    const [formPending, setFormPending] = useState(false);

    // Get set of clients from Clockify data
    const result = useClockifyData();
    let clockifyData, clientList;
    const clientSet = new Set();
    if (result.isError) {
        // We had an error, show error message below
    } else if (!result.isLoading) {
        clockifyData = result.data;
        clockifyData = clockifyData.map((data) => new ClockifyProject(data));

        clientList = clockifyData.filter((proj) => {
            const duplicate = clientSet.has(proj.name);
            clientSet.add(proj.name);
            return !duplicate;
        });
    }

    // Set default to empty array to prevent iterable error
    const form = useForm({
        defaultValues: {
            excludedClients: [],
        },
    });

    // Update form's default values when data loads from Clerk
    useEffect(() => {
        if (isLoaded) {
            form.setValue(
                "excludedClients",
                user.publicMetadata.excludedClients
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    // Form submission handler
    async function onSubmit(data) {
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

        // if save was successful, invalidate "clockifyData" query to refetch
        if (result) {
            queryClient.invalidateQueries(["clockifyData"]);
        }

        setFormPending(false);
    }

    return (
        <Card className="mb-5">
            <CardBody>
                <div className="flex flex-col gap-3">
                    <Typography variant="h5">Excluded Clients</Typography>
                    {result.isLoading ? (
                        <Spinner className="h-6 w-6" />
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
                                                                    className="flex items-center gap-2 space-y-0 rounded-md px-2 py-1 hover:bg-blue-gray-50"
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
                                                                    <FormLabel className="text-md text-blue-gray w-full cursor-pointer font-normal">
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
                                            <Spinner
                                                className="inline h-3 w-3"
                                                color="white"
                                            />
                                        ) : (
                                            "Save Excluded Clients"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default ExcludedClientSettings;
