import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@material-tailwind/react";
import Table from "./Table";
import fetchClockifyData from "./fetchClockifyData";

const TablesPage = () => {
    const results = useQuery(["data"], fetchClockifyData);

    if (results.isLoading) {
        return <Spinner className="h-10 w-10" />;
    }

    const tableHeaders = ["Client", "Hours Remaining"];

    const tableData = [
        { name: "3BL Media", value: 63 },
        { name: "AG Mednet", value: 96 },
        { name: "C.H. Newton Builders", value: 72 },
        { name: "Dysis Medical Inc", value: 60 },
        { name: "Ori, Inc.", value: 44 },
        { name: "Specified Technologies, Inc.", value: 97 },
    ];

    return (
        <div className="w-full xl:w-2/3">
            <Table
                title="Managed Services"
                data={tableData}
                headers={tableHeaders}
            />
            <Table
                title="Block Hours"
                data={tableData}
                headers={tableHeaders}
            />
            <Table title="Projects" data={tableData} headers={tableHeaders} />
        </div>
    );
};

export default TablesPage;
