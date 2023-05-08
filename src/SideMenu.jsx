import { Sidebar } from "flowbite-react";
import {
    ChartPieIcon,
    TableCellsIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/solid";

const SideMenu = () => {
    return (
        <div className="w-fit">
            <Sidebar aria-label="Client Monitor Sidebar">
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item href="#" icon={ChartPieIcon}>
                            Dashboard
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={TableCellsIcon}>
                            Tables
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item href="#" icon={Cog6ToothIcon}>
                            Settings
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    );
};

export default SideMenu;
