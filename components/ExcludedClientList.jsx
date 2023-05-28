import {
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Checkbox,
} from "@material-tailwind/react";

const ExcludedClientList = ({ title, clientData }) => {
    return (
        <>
            <Typography variant="h6">{title}</Typography>
            <List>
                {clientData.map(({ name, uid }) => (
                    <ListItem key={uid} className="p-0">
                        <label className="flex w-full cursor-pointer items-center px-3">
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                />
                            </ListItemPrefix>
                            <Typography
                                color="blue-gray"
                                className="font-normal"
                            >
                                {name}
                            </Typography>
                        </label>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default ExcludedClientList;
