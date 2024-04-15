import { API, useGlobalContext } from "@/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import ProfilePic from "./components/ProfilePic";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loadingspinner";
import { ScrollArea } from "@/components/ui/scroll-area";

const Summary = () => {
  const { article } = useGlobalContext();

  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getSummary = async () => {
    // Fetch summary from server
    setIsLoading(true);
    const response = await fetch(API + "/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('jwt') || "",
      },
      body: JSON.stringify({
        headline: article.title,
        body: article.excerpt
      })
    });
    const data = await response.json();
    return data.response;
  };

  const handleGetSummary = async () => {
    const summary = await getSummary();
    setSummary(summary);
    setIsLoading(false);
  };

  return (
    <TabsContent
      value="summary"
      className="grow align-middle justify-items-center"
    >
      <Card className="h-full">
        <Link to="/profile">
          <ProfilePic className="justify-self-end mt-3 mr-3" />
        </Link>
        <CardHeader className="pt-2">
          <CardTitle className="text-xl">Article Summary</CardTitle>
          <CardDescription>Summarize the article using AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-72 rounded-md border">
            {
              isLoading ? (
                <LoadingSpinner size={24} text="Loading Summary" />
              ) : (
                <ScrollArea className="h-full w-full p-2">
                  {summary}
                </ScrollArea>
              )
            }
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleGetSummary}>
            Get Summary
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}

export default Summary;
