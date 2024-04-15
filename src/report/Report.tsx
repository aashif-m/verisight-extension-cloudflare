import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Crosscheck from "./Crosscheck";
import Summary from "./Summary";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import UserNoteAdd from "./UserNoteAdd";
import UserNoteView from "./UserNoteView";
import { API, useGlobalContext } from "@/GlobalContext";
import { useEffect, useState } from "react";
import ProfilePic from "./components/ProfilePic";
import { Link } from "react-router-dom";
import { Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Report = () => {
  return (
    <Tabs defaultValue="incongruence" className="flex flex-col grow">
      <Crosscheck />
      <Summary />
      <Incongruence />
      <TabsList className="grid w-full grid-cols-3 mb-2 mt-2">
        <TabsTrigger value="crosscheck">Crosscheck</TabsTrigger>
        <TabsTrigger value="incongruence">Incongruence</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const Incongruence = () => {
  const { article } = useGlobalContext();

  const [prediction, setPrediction] = useState("");

  const [predictionColor, setPredictionColor] = useState("");

  const [featuredNote, setFeaturedNote] = useState("");

  useEffect(() => {
    fetch(API + "/incongruence", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
      body: JSON.stringify({
        headline: article.title,
        body: article.content
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        type PredictionMapping = {
          [key: string]: { text: string; color: string };
        };

        const predictionMapping: PredictionMapping = {
          "congruent": { text: "Congruent", color: "text-green-500 fill-green-500" },
          "incongruent": { text: "Incongruent", color: "text-red-500 fill-red-500" },
        };

        const predictionData =
          predictionMapping[data.response];
        setPrediction(predictionData.text);
        setPredictionColor(predictionData.color);
      });

    fetch(API + "/note/featured/" + article.id, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
    })
      .then((response) => response.json())
      .then((note) => {
        setFeaturedNote(note.content);
      });
  }, []);

  return (
    <TabsContent
      value="incongruence"
      className="grow align-middle justify-items-center"
    >
      <Card className="h-full">
        <Link to="/profile">
          <ProfilePic className="justify-self-end mt-3 mr-3" />
        </Link>
        <CardHeader className="pt-2">
          <CardTitle className="mb-1 text-xl text-nowrap truncate">
            {article.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <CardTitle>Headline Body Congruence</CardTitle>
          <div className="flex h-9 w-full rounded-md border px-3 py-1 items-center justify-center">
            <Circle className={predictionColor} />{" "}
            <span className="pl-1">Article and Body is {prediction}</span>
          </div>
        </CardContent>
        <CardContent>
          <div className="space-y-5">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              <CardTitle>Featured Note</CardTitle>
            </p>
            <div className="h-48 rounded-md border">
              {featuredNote ? (
                <ScrollArea className="h-full w-full p-2">
                  {featuredNote}
                </ScrollArea>
              ) : (
                <div className="mt-4 text-center">
                  No featured note available
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className=" grid w-full grid-cols-2 space-x-4">
          <UserNoteAdd />
          <UserNoteView />
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default Report;
