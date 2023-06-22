import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WelcomeCardProps {
    isLoaded: boolean;
    hasKey: boolean;
}

export default function WelcomeCard({ isLoaded, hasKey }: WelcomeCardProps) {
    if (!isLoaded || hasKey) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to the Client Monitor!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    To get started, you need to add your Clockify API key below:
                </p>
                <ol className="list-decimal space-y-2 pl-8 pt-2">
                    <li>
                        Login to{" "}
                        <Link
                            href="https://app.clockify.me/en/login"
                            className="underline underline-offset-4"
                        >
                            Clockify
                        </Link>
                    </li>
                    <li>
                        Go to your{" "}
                        <Link
                            href="https://app.clockify.me/user/settings"
                            className="underline underline-offset-4"
                        >
                            profile page
                        </Link>
                    </li>
                    <li>At the bottom of the page, find the API key section</li>
                    <li>
                        If no key exists, click the generate button to create a
                        new one
                    </li>
                    <li>
                        Copy the key and paste it into the field below, then
                        click Save
                    </li>
                </ol>
                <p className="pt-6">
                    Once you save your API key below, you will have full access
                    to all pages on the site.
                </p>
            </CardContent>
        </Card>
    );
}
