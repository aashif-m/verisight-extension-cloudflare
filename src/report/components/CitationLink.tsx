import { buttonVariants } from "@/components/ui/button";
import { Link } from "lucide-react";


const CitationLink = ({ source }: {source: string}) => {
    const hostname = new URL(source).hostname;



    return (
        <>

            <a
                href={source}
                target="_blank"
                rel="noreferrer"
                className={`${buttonVariants({ variant: "outline" })}`}
                style={{ justifyContent: "normal" }}
            >
                <Link className=" pr-2"/>
                {hostname}
            </a>
        </>
    );
}

export default CitationLink;