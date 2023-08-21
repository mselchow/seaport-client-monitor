import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSummaryCardProps {
    cardTitle: string;
    cardContent: string;
    isLoading: boolean;
    progress?: number;
}

export default function DashboardSummaryCard({
    cardTitle,
    cardContent,
    isLoading = false,
    progress = -1,
}: DashboardSummaryCardProps) {
    const badgeElement =
        progress === -1 ? null : (
            <Badge variant="default">{progress + "%"}</Badge>
        );

    const progressContent =
        progress === -1 ? null : <Progress value={progress} className="mt-3" />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {cardTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-auto" />
                ) : (
                    <>
                        <div className="flex flex-row items-center justify-between">
                            <div className="text-2xl font-bold">
                                {cardContent}
                            </div>
                            {badgeElement}
                        </div>
                        <div>{progressContent}</div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
