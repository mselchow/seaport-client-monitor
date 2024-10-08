import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

import HorizontalBarSkeleton from "@/components/skeletons/HorizontalBarSkeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table as Table2,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
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
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("default");

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleSortingChange = ({ accessor, dataType }: SortingChangeType) => {
        const sortOrder: SortOrderType = order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder, dataType);
    };

    const handleSorting = (
        sortField: keyof ClockifyProject,
        sortOrder: SortOrderType,
        dataType: string
    ) => {
        if (sortField) {
            const sorted = [...(tableData as ClockifyProject[])].sort(
                (a, b) => {
                    // Check for null values first
                    if (a[sortField] === null) return 1;
                    if (b[sortField] === null) return -1;
                    if (a[sortField] === null && b[sortField] === null)
                        return 0;

                    if (dataType === "string") {
                        return (
                            a[sortField]
                                .toString()
                                .localeCompare(b[sortField].toString(), "en", {
                                    numeric: true,
                                }) * (sortOrder === "asc" ? 1 : -1)
                        );
                    } else {
                        // Number field
                        return sortOrder === "asc"
                            ? Number(a[sortField]) - Number(b[sortField])
                            : Number(b[sortField]) - Number(a[sortField]);
                    }
                }
            );
            setTableData(sorted);
        }
    };

    return (
        <div className="">
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
                                                        : null
                                                }
                                                className={cn(
                                                    sortable
                                                        ? "cursor-pointer"
                                                        : "",
                                                    dataType === "number"
                                                        ? "text-right"
                                                        : ""
                                                )}
                                            >
                                                <TypographySmall className="flex items-center justify-between">
                                                    {label}
                                                    {sortable
                                                        ? " " + sortField ===
                                                          accessor
                                                            ? ENUM_ICONS[order]
                                                            : ENUM_ICONS[
                                                                  "default"
                                                              ]
                                                        : ""}
                                                </TypographySmall>
                                            </TableHead>
                                        )
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData?.map((proj) => (
                                    <TableRow key={proj.uid}>
                                        {headers.map((header) => (
                                            <TableCell
                                                key={header.accessor}
                                                className={cn(
                                                    "py-3",
                                                    header.dataType === "number"
                                                        ? "text-right"
                                                        : ""
                                                )}
                                            >
                                                {proj[header.accessor]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table2>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Table;
