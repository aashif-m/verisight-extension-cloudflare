import { createContext, useContext, useState } from "react";

const GlobalContext = createContext({} as any);

export const useGlobalContext = () => useContext(GlobalContext);

const AppContext = (props: any) => {
  const [article, setArticle] = useState({
    title: "",
    content: "",
    link: "",
    datePublished: "",
    prediction: 0,
    excerpt: "",
  });

  const [user, setUser] = useState("");

  interface Note {
    id: number,
    content: string,
    userId: number,
    articleId: number
  }

  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <GlobalContext.Provider
      value={{
        article,
        setArticle,
        user,
        setUser,
        notes,
        setNotes,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export const API = "https://verisight-cf.aashif.workers.dev";

export default AppContext;
