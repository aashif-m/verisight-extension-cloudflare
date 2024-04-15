import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "../report/components/Note";
// import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { API, useGlobalContext } from "@/GlobalContext";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import { LogOut, Home } from "lucide-react";

const Profile = () => {
  const { user } = useGlobalContext();

  const { notes, setNotes } = useGlobalContext();

  const navigate = useNavigate();

  //Fetch notes of the specific user from the server
  const fetchNotes = async () => {
    await fetch(API + "/user", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Card className="my-2">
      <div className="grid grid-cols-3 place-items-center">
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <CardHeader className="px-3  space-y-0 col-span-2 mr-1">
          <CardTitle className="text-[20px] p-0 m-0">
            {user ? user : "Error Loading"}
          </CardTitle>
        </CardHeader>
      </div>

      <CardContent className="items-center p-6 pt-0 flex pb-4 justify-between">
        <ChangePassword />
        <DeleteAccount />
      </CardContent>
      <CardContent className="space-y-2 mx-5 mb-3 p-3 rounded-[10px] border ">
        <div className="flex justify-center">
          <CardTitle className="text-lg">Notes Activity</CardTitle>
        </div>
        <div className="space-y-1">
          <ScrollArea className="h-72 w-full p-4">
            {notes?.length === 0 ? (
              <p className="text-center text-sm">No Notes</p>
            ) : (
              notes?.map((note: any) => (
                <Note content={note.content} id={note.id} upVote={false} />
              ))
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex pb-4 justify-between">
        <Link to="/">
          <Button className="w-[8.5rem] p-1 align-middle" variant="outline">
            <Home className="mr-1 w-4 h-4" />
            Back to Home
          </Button>
        </Link>
        <Button
          onClick={handleLogout}
          className="w-[8.5rem] p-1 align-middle"
          variant="destructive"
        >
          <LogOut className="mr-1 w-4 h-4" />
          Log Out
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Profile;
