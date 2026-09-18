import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

import HorizontalBarSkeleton from "@/components/skeletons/HorizontalBarSkeleton";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table as Table2,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TypographySmall } from "@/components/ui/typography";
import ClockifyProject from "@/lib/clockifyProject";
import { cn } from "@/lib/utils";

interface TableHeaderType {
    label: string;
    accessor: keyof ClockifyProject;
    dataType: string;
    sortable: boolean;
}

interface TableProps {
    title: string;
    data: ClockifyProject[] | null;
    headers: TableHeaderType[];
    isLoading?: boolean;
    expectedRows?: number;
}

interface SortingChangeType {
    accessor: keyof ClockifyProject;
    dataType: string;
}

type SortOrderType = "asc" | "desc";

const ENUM_ICONS: { [key: string]: JSX.Element } = {
    asc: <ChevronUp className="h-4 w-4" />,
    desc: <ChevronDown className="h-4 w-4" />,
    default: <ChevronsUpDown className="h-4 w-4" />,
};

const Table = ({
    title,
    data,
    headers,
    isLoading = false,
    expectedRows = 5,
}: TableProps) => {
    const [tableData, setTableData] = useState(data);
    const [sortField, setSortField] = useState<keyof ClockifyProject | null>(
        null
    );
    const [order, setOrder] = useState<SortOrderType | "default">("default");

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleSortingChange = ({ accessor, dataType }: SortingChangeType) => {
        const sortOrder: SortOrderType =
            sortField === accessor && order === "asc" ? "desc" : "asc";

        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder, dataType);
    };

    const handleSorting = (
        field: keyof ClockifyProject,
        sortOrder: SortOrderType,
        dataType: string
    ) => {
        const sorted = [...(tableData ?? [])].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (dataType === "string") {
                return (
                    String(aValue).localeCompare(String(bValue), "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                );
            }

            return sortOrder === "asc"
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        });

        setTableData(sorted);
    };

    return (
        <Card id={title} className="h-full">
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <HorizontalBarSkeleton expectedRows={expectedRows} />
                ) : (
                    <Table2>
                        <TableHeader>
                            <TableRow>
                                {headers.map(
                                    ({
                                        label,
                                        accessor,
                                        dataType,
                                        sortable,
                                    }) => (
                                        <TableHead
                                            key={accessor}
                                            onClick={() =>
                                                sortable
                                                    ? handleSortingChange({
                                                          accessor,
                                                          dataType,
                                                      })
                                                    : undefined
                                            }
                                            className={cn(
                                                sortable ? "cursor-pointer" : "",
                                                dataType === "number"
                                                    ? "text-right"
                                                    : ""
                                            )}
                                        >
                                            <TypographySmall className="flex items-center justify-between">
                                                {label}
                                                {sortable
                                                    ? sortField === accessor
                                                        ? ENUM_ICONS[order]
                                                        : ENUM_ICONS.default
                                                    : null}
                                            </TypographySmall>
                                        </TableHead>
                                    )
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData?.map((proj) => (
                                <TableRow key={proj.uid}>
                                    {headers.map((header) => {
                                        const value = proj[header.accessor];

                                        return (
                                            <TableCell
                                                key={header.accessor}
                                                className={cn(
                                                    "py-3",
                                                    header.dataType === "number"
                                                        ? "text-right"
                                                        : ""
                                                )}
                                            >
                                                {value == null
                                                    ? ""
                                                    : String(value)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table2>
                )}
            </CardContent>
        </Card>
    );
};

export default Table;
