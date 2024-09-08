import { Skeleton } from "@/components/ui/skeleton";
import { CHART_HEIGHT_MULTIPLIER } from "@/lib/consts";

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
        <div className="space-y-1">
            {skeletonLoader.map((i) => (
                <Skeleton
                    key={i}
                    className={`h-[${CHART_HEIGHT_MULTIPLIER}px] w-full`}
                />
            ))}
        </div>
    );
}
