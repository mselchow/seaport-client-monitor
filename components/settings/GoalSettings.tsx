import SettingsPage from "@/components/settings/SettingsPage";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useEffect } from "react";

export interface GoalsType {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
}

const formMinValueErrorMessage = "Goal must be a positive number.";
const formInvalidTypeErrorMessage = "Goal must be a number.";

const formSchema = z.object({
    daily: z.coerce
        .number({
            invalid_type_error: formInvalidTypeErrorMessage,
        })
        .nonnegative(formMinValueErrorMessage)
        .optional(),
    weekly: z.coerce
        .number({
            invalid_type_error: formInvalidTypeErrorMessage,
        })
        .nonnegative(formMinValueErrorMessage)
        .optional(),
    monthly: z.coerce
        .number({
            invalid_type_error: formInvalidTypeErrorMessage,
        })
        .nonnegative(formMinValueErrorMessage)
        .optional(),
    yearly: z.coerce
        .number({
            invalid_type_error: formInvalidTypeErrorMessage,
        })
        .nonnegative(formMinValueErrorMessage)
        .optional(),
});

export default function GoalSettings() {
    const { user, isLoaded } = useUser();
    const [formPending, setFormPending] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            daily: 0,
            weekly: 0,
            monthly: 0,
            yearly: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setFormPending(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                goals: values,
            }),
        };

        const response = await fetch("/api/saveUserGoals", options);
        const result = await response.json();

        // if save was successful, invalidate Clockify data query to refetch
        if (result) {
            form.reset();
            toast({
                title: "Success!",
                description: "Goals saved.",
                duration: 5000,
                variant: "primary",
            });
            if (user) {
                user.reload();
            }
        } else {
            toast({
                title: "Error!",
                description: "Unable to save goals.",
                duration: 5000,
                variant: "destructive",
            });
        }

        console.log(values);
        setFormPending(false);
    }

    // Update form's default values when data loads from Clerk
    useEffect(() => {
        if (isLoaded && user && user.publicMetadata.goals) {
            const goals = user.publicMetadata.goals as GoalsType;

            form.setValue("daily", goals.daily);
            form.setValue("weekly", goals.weekly);
            form.setValue("monthly", goals.monthly);
            form.setValue("yearly", goals.yearly);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    return (
        <SettingsPage
            title="Goal Settings"
            description="Customize your goals to track your progress."
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="daily"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Daily Goal</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Daily Goal"
                                        id="daily"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weekly"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Weekly Goal</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Weekly Goal"
                                        id="weekly"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="monthly"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Monthly Goal</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Monthly Goal"
                                        id="monthly"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="yearly"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Yearly Goal</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Yearly Goal"
                                        id="yearly"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={formPending}
                        className="w-28"
                    >
                        {formPending ? (
                            <Loader2 className="inline h-4 w-4 animate-spin" />
                        ) : (
                            "Save Goals"
                        )}
                    </Button>
                </form>
            </Form>
        </SettingsPage>
    );
}
