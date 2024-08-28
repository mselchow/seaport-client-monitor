import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardChartSkeleton() {
    return (
        <div className="flex items-end justify-around">
            <Skeleton className="h-[125px] w-[11%]" />
            <Skeleton className="h-[250px] w-[11%]" />
            <Skeleton className="h-[425px] w-[11%]" />
            <Skeleton className="h-[500px] w-[11%]" />
            <Skeleton className="h-[425px] w-[11%]" />
            <Skeleton className="h-[250px] w-[11%]" />
            <Skeleton className="h-[125px] w-[11%]" />
        </div>
    );
}
