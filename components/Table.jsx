import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
        <div className="pb-5">
            <Card id={title}>
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
                        <table className="w-full min-w-max table-auto text-left">
                            {headers.length === 2 ? (
                                <colgroup>
                                    <col className="w-3/5" />
                                    <col className="w-2/5" />
                                </colgroup>
                            ) : (
                                ""
                            )}
                            <thead>
                                <tr>
                                    {headers.map(
                                        ({
                                            label,
                                            accessor,
                                            dataType,
                                            sortable,
                                        }) => (
                                            <th
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
                                                    "border-b bg-accent p-4 brightness-95",
                                                    sortable
                                                        ? "cursor-pointer hover:brightness-90"
                                                        : ""
                                                )}
                                            >
                                                <TypographySmall className="flex items-center justify-between font-normal leading-none opacity-70">
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
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData?.map((proj) => (
                                    <tr
                                        key={proj.uid}
                                        className="even:bg-muted"
                                    >
                                        {headers.map((header) => (
                                            <td
                                                key={header.accessor}
                                                className="p-2 px-4"
                                            >
                                                <TypographySmall className="font-normal">
                                                    {proj[header.accessor]}
                                                </TypographySmall>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Table;
