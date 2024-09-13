import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface HorizontalBarSkeletonProps {
    expectedRows?: number;
}

export default function HorizontalBarSkeleton({
    expectedRows = 6,
}: HorizontalBarSkeletonProps) {
    const skeletonLoader = [];
    for (let i = 0; i < expectedRows; i++) {
        skeletonLoader[i] = i;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-[35px] w-full" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-1">
                    {skeletonLoader.map((i) => (
                        <Skeleton key={i} className="h-[35px] w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
