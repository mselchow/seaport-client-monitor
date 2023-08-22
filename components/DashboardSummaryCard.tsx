import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSummaryCardProps {
    cardTitle: string;
    cardContent: string;
    isLoading: boolean;
    progress?: number | typeof NaN;
}

export default function DashboardSummaryCard({
    cardTitle,
    cardContent,
    isLoading = false,
    progress = NaN,
}: DashboardSummaryCardProps) {
    const badgeElement = !isNaN(progress) ? (
        <Badge variant="default">{progress + "%"}</Badge>
    ) : null;

    const progressContent = !isNaN(progress) ? (
        <Progress value={progress} className="mt-3" />
    ) : null;

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
