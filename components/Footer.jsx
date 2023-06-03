import { useState } from "react";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";

const Footer = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6 place-self-end border-t py-4 text-center">
            <ul className="flex flex-wrap items-center gap-10">
                <li>
                    <a
                        href="https://github.com/mselchow/seaport-client-monitor"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline underline-offset-4"
                    >
                        <TypographySmall>GitHub</TypographySmall>
                    </a>
                </li>
                <li>
                    <Button
                        variant="link"
                        onClick={handleOpen}
                        className="underline underline-offset-4"
                    >
                        <TypographySmall>Feedback</TypographySmall>
                    </Button>
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
