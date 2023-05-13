import { Card, Typography } from "@material-tailwind/react";

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
            <Card className="overflow-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {headers.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(({ name, value }) => (
                            <tr key={name} className="even:bg-blue-gray-50/50">
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
                                        {value}
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
