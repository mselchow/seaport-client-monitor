import { useState } from "react";
import { Typography, Dialog, DialogBody } from "@material-tailwind/react";

const Footer = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <footer className="fixed bottom-0 flex w-full flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6 border-t border-blue-gray-50 py-6 text-center">
            <ul className="flex flex-wrap items-center gap-10">
                <li>
                    <Typography
                        as="a"
                        href="https://github.com/mselchow/seaport-client-monitor"
                        color="blue-gray"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        GitHub
                    </Typography>
                </li>
                <li>
                    <Typography
                        as="a"
                        onClick={handleOpen}
                        color="blue-gray"
                        className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                    >
                        Feedback
                    </Typography>
                </li>
            </ul>

            <Dialog
                open={open}
                size="lg"
                handler={handleOpen}
                className="overflow-scroll"
            >
                <DialogBody className="overflow-scroll [height:80vh]">
                    <iframe
                        title="Asana Form"
                        className="h-full w-full"
                        src="https://form.asana.com/?k=XFPxo4FT9PncwdzMNrNm4A&d=881126945849896&embed=true"
                    ></iframe>
                </DialogBody>
            </Dialog>
        </footer>
    );
};

export default Footer;
