import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { TypographyH3, TypographyP } from "@/components/ui/typography";

interface SettingsPageProps {
    title: string;
    description?: string;
    children: ReactNode;
}

const SettingsPage = ({ title, description, children }: SettingsPageProps) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{title}</h3>
                {description ? (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
            <Separator />
            {children}
        </div>
    );
};

export default SettingsPage;
