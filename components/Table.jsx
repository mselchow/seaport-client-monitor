import { Card, Typography } from "@material-tailwind/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";

// TODO: adjust below code to accommodate any array length for data
const Table = ({ title, data, headers }) => {
    if (!data.length) {
        return;
    }

    return (
        <div className="pb-10">
            <Typography variant="h4" className="pb-2">
                {title}
            </Typography>
            <Card className="overflow-auto" id={title}>
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {headers.map((head, index) => (
                                <th
                                    key={head}
                                    className="cursor-pointer border-b border-blue-gray-100 bg-blue-gray-50 p-4 hover:bg-blue-gray-100"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-between font-normal leading-none opacity-70"
                                    >
                                        {head}{" "}
                                        <ChevronUpDownIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(({ name, uid, hoursRemaining }) => (
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
