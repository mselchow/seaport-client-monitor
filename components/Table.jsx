import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { TypographyH3, TypographySmall } from "@/components/ui/typography";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { Loader2 } from "lucide-react";

const Table = ({ title, data, headers, isLoading = false }) => {
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

    return (
        <div className="pb-10">
            <TypographyH3 className="pb-2">{title}</TypographyH3>
            {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
                <Card className="overflow-auto" id={title}>
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
                                                        : ENUM_ICONS["default"]
                                                    : ""}
                                            </TypographySmall>
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData?.map((proj) => (
                                <tr key={proj.uid} className="even:bg-muted">
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
                </Card>
            )}
        </div>
    );
};

export default Table;
