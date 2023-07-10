import SettingsPage from "@/components/settings/SettingsPage";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";

const formSchema = z.object({
    theme: z.enum(["light", "dark", "system"], {
        required_error: "Please select a theme option.",
    }),
});

export default function DisplaySettings() {
    const { theme, setTheme } = useTheme();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            theme: theme as "light" | "dark" | "system",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setTheme(values.theme);
    }

    return (
        <SettingsPage
            title="Display Settings"
            description="Customize the appearance of the Client Monitor."
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Theme</FormLabel>
                                <FormDescription>
                                    Select the theme for the app.
                                </FormDescription>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="light" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Light
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="dark" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Dark
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="system" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                System
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Save Display Settings</Button>
                </form>
            </Form>
        </SettingsPage>
    );
}
