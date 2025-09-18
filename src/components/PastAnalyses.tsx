import { AiResponse, Sentiment } from "@/types";
import axios from "axios";
import { Dropdown, DropdownItem, TextInput } from "flowbite-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AnalysesTable } from "./AnalysesTable";
import { DEFAULT_LOADING_ANALYSES } from "@/constants";

let timeout: NodeJS.Timeout;

export function PastAnalyses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<AiResponse[]>([]);

  const getAnalyses = useCallback(async () => {
    setIsLoading(true);

    const response = await axios.get("/api", {
      params: {
        sentiment,
        searchTerm: searchTerm.trim(),
      },
    });

    setResults(response.data);
    setIsLoading(false);
  }, [searchTerm, sentiment]);

  useEffect(() => {
    getAnalyses();
  }, [getAnalyses]);

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout);

    const newText = event.target.value;

    timeout = setTimeout(() => {
      setSearchTerm(newText);
    }, 500);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between gap-6">
        <TextInput
          className="w-full"
          icon={FaSearch}
          placeholder="Search by summary, topics or nouns"
          onChange={onSearch}
        />
        <Dropdown label="Sentiment" className="cursor-pointer">
          <DropdownItem onClick={() => setSentiment(null)}>Any</DropdownItem>
          <DropdownItem onClick={() => setSentiment(Sentiment.Positive)}>
            {Sentiment.Positive}
          </DropdownItem>
          <DropdownItem onClick={() => setSentiment(Sentiment.Neutral)}>
            {Sentiment.Neutral}
          </DropdownItem>
          <DropdownItem onClick={() => setSentiment(Sentiment.Negative)}>
            {Sentiment.Negative}
          </DropdownItem>
        </Dropdown>
      </div>
      <AnalysesTable
        isLoading={isLoading}
        results={results}
        articles={DEFAULT_LOADING_ANALYSES}
      />
    </section>
  );
}
