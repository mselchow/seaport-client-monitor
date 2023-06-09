import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table as Table2,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographySmall } from "@/components/ui/typography";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

const Table = ({
    title,
    data,
    headers,
    isLoading = false,
    expectedRows = 5,
}) => {
    const [tableData, setTableData] = useState(data);
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("default");

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleSortingChange = (accessor, dataType) => {
        const sortOrder = order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder, dataType);
    };

    const handleSorting = (sortField, sortOrder, dataType) => {
        if (sortField) {
            const sorted = [...tableData].sort((a, b) => {
                // Check for null values first
                if (a[sortField] === null) return 1;
                if (b[sortField] === null) return -1;
                if (a[sortField] === null && b[sortField] === null) return 0;

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
                        ? a[sortField] - b[sortField]
                        : b[sortField] - a[sortField];
                }
            });
            setTableData(sorted);
        }
    };

    const ENUM_ICONS = {
        asc: <ChevronUp className="h-4 w-4" />,
        desc: <ChevronDown className="h-4 w-4" />,
        default: <ChevronsUpDown className="h-4 w-4" />,
    };

    let skeletonLoader = [];
    for (let i = 0; i < expectedRows; i++) {
        skeletonLoader[i] = i;
    }

    return (
        <div className="">
            <Card id={title} className="h-full">
                <CardHeader>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-1">
                            <Skeleton className="h-10 w-full" />
                            {skeletonLoader.map((i) => (
                                <Skeleton key={i} className="h-9 w-full" />
                            ))}
                        </div>
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
                                                onClick={
                                                    sortable
                                                        ? () =>
                                                              handleSortingChange(
                                                                  accessor,
                                                                  dataType
                                                              )
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
