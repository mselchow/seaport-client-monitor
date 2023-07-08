import Link from "next/link";

export default function WelcomeCard() {
    return (
        <div>
            <p>To get started, you need to add your Clockify API key below:</p>
            <ol className="list-decimal space-y-2 py-6 pl-8">
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
                    If no key exists, click the generate button to create a new
                    one
                </li>
                <li>
                    Copy the key and paste it into the field below, then click
                    Save
                </li>
            </ol>
            <p>
                Once you save your API key below, you will have full access to
                all pages on the site.
            </p>
        </div>
    );
}
