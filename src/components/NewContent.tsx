import { Button, Label, Textarea } from "flowbite-react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import {
  MdAddCircle,
  MdOutlineCancel,
  MdOutlineRestartAlt,
} from "react-icons/md";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Article, AiResponse } from "@/types";
import { BUTTON_ICON_SIZE, DEFAULT_ARTICLES } from "@/constants";
import { AnalysesTable } from "./AnalysesTable";

const timeouts: Record<Article["id"], NodeJS.Timeout> = {};

export function NewContent() {
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AiResponse[]>([]);
  const shouldStop = useRef(false);

  const deleteArticle = (id: Article["id"]) => {
    setArticles((articles) => articles.filter((article) => id !== article.id));
  };

  const addNewArticle = () => {
    setArticles((articles) => [
      ...articles,
      {
        id: crypto.randomUUID(),
        text: "",
      },
    ]);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    shouldStop.current = false;

    // Handle only long enough articles
    const validArticles = articles.filter(
      ({ text }) => text.trim().length > 10,
    );

    for await (const article of validArticles) {
      if (shouldStop.current) break;

      const response = await axios.post<AiResponse>("/api", {
        text: article.text,
      });

      setResults((results) => [...results, response.data]);
    }

    setIsLoading(false);
  };

  const onChange = (id: Article["id"]) => {
    return (event: ChangeEvent<HTMLTextAreaElement>) => {
      clearTimeout(timeouts[id]);

      const newText = event.target.value;

      timeouts[id] = setTimeout(() => {
        setArticles((articles) =>
          articles.map((article) =>
            article.id === id
              ? {
                  ...article,
                  text: newText,
                }
              : article,
          ),
        );
      }, 500);
    };
  };

  const stop = () => {
    shouldStop.current = true;
    setIsLoading(false);
  };

  const reset = () => {
    stop();
    setArticles(DEFAULT_ARTICLES);
    setResults([]);
  };

  const haveManyArticles = articles.length > 1;

  const shouldShowResults = isLoading || !!results.length;

  return shouldShowResults ? (
    <section className="flex w-full flex-col gap-4">
      <AnalysesTable
        results={results}
        isLoading={isLoading}
        articles={articles}
      />
      <div className="flex justify-between">
        {isLoading && (
          <Button onClick={stop} className="cursor-pointer gap-2" color="red">
            <MdOutlineCancel size={BUTTON_ICON_SIZE} />
            Stop
          </Button>
        )}
        <Button onClick={reset} className="ml-auto cursor-pointer gap-2">
          <MdOutlineRestartAlt size={BUTTON_ICON_SIZE} />
          Start Again
        </Button>
      </div>
    </section>
  ) : (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
      {articles.map((article, index) => (
        <div
          key={article.id}
          className="flex flex-col gap-3 rounded-lg border border-gray-300 bg-gray-100 p-6 dark:border-gray-600 dark:bg-gray-800"
        >
          <div className="flex justify-between">
            <Label className="text-base" htmlFor={`comment-${article.id}`}>
              Your article or blog post{" "}
              {haveManyArticles ? `#${index + 1}` : ""}
            </Label>

            {haveManyArticles && (
              <MdDelete
                size={BUTTON_ICON_SIZE}
                className="cursor-pointer dark:text-white"
                onClick={() => deleteArticle(article.id)}
              />
            )}
          </div>

          <Textarea
            id={`comment-${article.id}`}
            placeholder="Paste your text here..."
            rows={10}
            onChange={onChange(article.id)}
          />
        </div>
      ))}

      <div className="flex justify-between">
        <Button
          className="cursor-pointer gap-2"
          color="alternative"
          onClick={addNewArticle}
        >
          <MdAddCircle size={BUTTON_ICON_SIZE} />
          Add More
        </Button>
        <Button
          disabled={isLoading}
          className="cursor-pointer px-5"
          type="submit"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
