import { API, useGlobalContext } from "@/GlobalContext";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const Upvote = (props: { id: string }) => {
  const { id } = props;

  const [upvoted, setUpvoted] = useState(false);

  useEffect(() => {
    fetch(API + "/note/isupvoted/" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
    })
      .then((response) => response.json())
      .then((data) => {
        setUpvoted(data.response);
      });
  }, []);

  return (
    <Toggle
      pressed={upvoted}
      onPressedChange={() => {
        fetch(API + "/note/vote/" + id, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
        }).then(() =>
          fetch(API + "/note/isupvoted/" + id, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
          })
            .then((response) => response.json())
            .then((data) => {
              setUpvoted(data.response);
            }))
      }}
    >
      <ThumbsUp className="h-4 w-4" />
    </Toggle >
  );
};

const Delete = (props: { id: string }) => {
  const { id } = props;
  const { notes, setNotes } = useGlobalContext();

  type Note = {
    id: number,
    content: string,
    userId: number,
    articleId: number
  };

  return (
    <button
      onClick={() => {
        fetch(API + "/note/delete/" + id, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('jwt') || "" },
        });
        setNotes(notes.filter((note: Note) => note.id !== Number(id)));
      }}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
};

export const Note = (props: {
  content: string;
  id: string;
  upVote: boolean;
}) => {
  const { content, id, upVote } = props;
  return (
    <Card className="mb-5 w-full" key={id}>
      <div className="p-4 flex justify-between items-center">
        <p className="text-sm">{content}</p>
        {upVote === true ? <Upvote id={id} /> : <Delete id={id} />}
      </div>
    </Card>
  );
};
