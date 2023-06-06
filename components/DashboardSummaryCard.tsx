import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSummaryCardProps {
    cardTitle: string;
    cardContent: string;
    isLoading: boolean;
}

export default function DashboardSummaryCard({
    cardTitle,
    cardContent,
    isLoading = false,
}: DashboardSummaryCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {cardTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {isLoading ? (
                        <Skeleton className="h-8 w-auto" />
                    ) : (
                        cardContent
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
