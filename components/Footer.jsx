import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";

const Footer = () => {
    return (
        <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6 place-self-end border-t py-4 text-center">
            <ul className="flex flex-wrap items-center gap-10">
                <li>
                    <a
                        href="https://github.com/mselchow/seaport-client-monitor"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        <TypographySmall className="underline underline-offset-4">
                            GitHub
                        </TypographySmall>
                    </a>
                </li>
                <li>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link">
                                <TypographySmall className="underline underline-offset-4">
                                    Feedback
                                </TypographySmall>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className=" min-w-[80%] overflow-scroll [height:80vh] lg:min-w-[60%]">
                            <iframe
                                title="Asana Form"
                                className="h-full w-full"
                                src="https://form.asana.com/?k=XFPxo4FT9PncwdzMNrNm4A&d=881126945849896&embed=true"
                            ></iframe>
                        </DialogContent>
                    </Dialog>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
