import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

export default function NotArticleError({ url }: { url: string }) {
  const mailContent = `Hello Verisight Labs, I think the ${url} is a news website. Please check it out.`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4 m-auto">
      <WarningIcon className=" size-14 " />
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
        Article doesn't seem to be a news website
      </p>
      <p className="leading-4 [&:not(:first-child)]:mt-6 text-xs text-center ">
        If you think this is a mistake press the button below to send us an
        email
      </p>
      <Button
        onClick={() => {
          window.open(
            "mailto:support@verisightlabs.com?subject=Article%20Misclassification&body=" +
              mailContent
          );
        }}
      >
        Send mail
      </Button>
      <Link to="/profile">
        <Button variant="outline">
          <PersonIcon className="mr-1" /> Go to Profile
        </Button>
      </Link>
    </div>
  );
}

const WarningIcon = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
