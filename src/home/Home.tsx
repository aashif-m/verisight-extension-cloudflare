import { API, useGlobalContext } from "@/GlobalContext";
import { LoadingSpinner } from "@/components/ui/loadingspinner";
import { Readability } from "@mozilla/readability";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotArticleError from "./components/NotArticleError";

const Home = () => {
  interface Article {
    id?: number;
    title: string;
    link: string;
    content: string,
    publishedTime: string;
  }

  const [isError, setIsError] = useState(false);

  const [url, setUrl] = useState("");

  const { setArticle } = useGlobalContext();

  const navigate = useNavigate();

  // This function parses an article from HTML and posts it to a server
  async function parseArticle(html: string, articleURL: string) {
    if (! await isNewsWebsite(html, articleURL)) {
      setIsError(true);
      return;
    }

    // Create a new DOMParser
    const parser = new DOMParser();

    // Parse the HTML string into a Document object
    const doc = parser.parseFromString(html, "text/html");

    // Use Readability to parse the article from the Document
    const parsedArticle = new Readability(doc).parse();

    // If the article was successfully parsed
    if (parsedArticle) {
      // Create an article object with the parsed data
      let article : Article = {
        title: parsedArticle.title.trim(),
        link: articleURL,
        content: parsedArticle.textContent,
        publishedTime: parsedArticle.publishedTime,
      };

      // Post the article to the server
      const articleId = await postArticle(article);
      article = {...article, id: articleId}

      // Set the article in the state and navigate to the report page
      setArticleAndNavigate(article, parsedArticle.excerpt.trim());
    }
  }

  // This function posts an article to the server
  async function postArticle(article: Article) : Promise<number> {
    const request = await fetch(API + '/article', {
      method: "PUT",
      headers: {
        "Authorization": localStorage.getItem('jwt') || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });
    const body = await request.json();
    return body.article.id
  }

  // This function sets the article in the state and navigates to the report page
  function setArticleAndNavigate(article: Article, excerpt: string) {
    setArticle({
      ...article,
      excerpt: excerpt,
    });
    navigate("/report");
  }
  async function isNewsWebsite(content: string, url: string) {
    const response = await fetch(API + "/article/whitelist", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem('jwt') || ""
      },
    })
    const data: { whitelist: string[] } = await response.json();
    const websiteWhitelist = data.whitelist;
    console.log(websiteWhitelist);

    const hostname = new URL(url).hostname;
    console.log(hostname);
    if (websiteWhitelist.includes(hostname)) {
      return true;
    }

    // Convert HTML content string to a DOM element
    const tempElement = document.createElement("div");
    tempElement.innerHTML = content;

    // Analyze the DOM structure and content to identify common patterns
    const articleElements = tempElement.querySelectorAll(
      'article, .article, .news, .story, .headline, [role="article"]'
    );
    const headlineElements = tempElement.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );
    const paragraphElements = tempElement.querySelectorAll("p");

    // Check if the page contains elements commonly found on news websites
    // Adjust these conditions based on the characteristics of news websites you want to detect
    const hasArticle = articleElements.length > 0;
    const hasHeadlines = headlineElements.length > 0;
    const hasParagraphs = paragraphElements.length > 0;

    // Determine if the webpage appears to be a news website based on the presence of common elements
    return hasArticle && hasHeadlines && hasParagraphs;
  }

  // This function fetches the HTML of the current tab and parses the article in it
  const handleFetchLink = async () => {
    // Define the options for the query
    let queryOptions = { active: true, currentWindow: true };

    // Query the current active tab
    let [tab] = await chrome.tabs.query(queryOptions);

    // If the tab exists and has an ID
    if (tab?.id && !(tab.url || "").startsWith("chrome://")) {
      // Execute a script in the tab to get the outer HTML of the document
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            return document.documentElement.outerHTML;
          },
        },
        async (injectionResults) => {
          // If the script execution was successful
          if (injectionResults[0].result) {
            // Parse the article in the HTML and post it to the server
            console.log(tab.url);
            setUrl(tab.url as string);
            await parseArticle(injectionResults[0].result, tab.url as string);
          }
        }
      );
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    handleFetchLink();
  }, []);

  return !isError ? (
    <div className="h-full">
      <LoadingSpinner text="Analysing article" />
    </div>
  ) : (
    <NotArticleError url={url} />
  );
};

export default Home;
