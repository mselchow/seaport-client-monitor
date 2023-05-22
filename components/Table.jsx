import { Card, Typography } from "@material-tailwind/react";
import { useState } from "react";
import {
    ChevronUpDownIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "@heroicons/react/24/solid";

// TODO: adjust below code to accommodate any array length for data
const Table = ({ title, data, headers }) => {
    const [tableData, setTableData] = useState(data);
    const [, setSortField] = useState("");
    const [order, setOrder] = useState("asc");

    if (!data.length) {
        return;
    }

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

    return (
        <div className="pb-10">
            <Typography variant="h4" className="pb-2">
                {title}
            </Typography>
            <Card className="overflow-auto" id={title}>
                <table className="w-full min-w-max table-auto text-left">
                    <colgroup>
                        <col className="w-3/5" />
                        <col className="w-2/5" />
                    </colgroup>
                    <thead>
                        <tr>
                            {headers.map(
                                ({ label, accessor, dataType, sortable }) => (
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
                                        className="cursor-pointer border-b border-blue-gray-100 bg-blue-gray-50 p-4 hover:bg-blue-gray-100"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between font-normal leading-none opacity-70"
                                        >
                                            {label}{" "}
                                            <ChevronUpDownIcon
                                                strokeWidth={2}
                                                className="h-4 w-4"
                                            />
                                        </Typography>
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(({ name, uid, hoursRemaining }) => (
                            <tr key={uid} className="even:bg-blue-gray-50/50">
                                <td className="p-2 px-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {name}
                                    </Typography>
                                </td>
                                <td className="p-2 px-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hoursRemaining}
                                    </Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Table;
