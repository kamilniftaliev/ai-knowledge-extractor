import { AiResponse, Article } from "@/types";
import { Badge } from "flowbite-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Skeleton } from "./Skeleton";
import { getConfidenceBadgeColor } from "@/utils";
import { ROW_CLASS, SENTIMENT_COLORS } from "@/constants";

interface Props {
  isLoading: boolean;
  articles: Article[];
  results: AiResponse[];
}

export function AnalysesTable({ isLoading, articles = [], results }: Props) {
  const emptyResults = !isLoading && results.length === 0;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>#</TableHeadCell>
          <TableHeadCell>Summary</TableHeadCell>
          <TableHeadCell>Sentiment</TableHeadCell>
          <TableHeadCell>Topics</TableHeadCell>
          <TableHeadCell>Nouns</TableHeadCell>
          <TableHeadCell>Confidence</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y">
        {emptyResults && (
          <TableRow className={ROW_CLASS}>
            <TableCell colSpan={6}>
              <p className="text-center">Nothing to show</p>
            </TableCell>
          </TableRow>
        )}
        {results.map(
          (
            { id, summary, sentiment, topics, nouns, confidenceScore, error },
            index,
          ) => (
            <TableRow
              key={error ? articles[index].id : id}
              className={ROW_CLASS}
            >
              <TableCell>{index + 1}</TableCell>
              {error ? (
                <TableCell colSpan={5}>
                  <p className="text-center">{error}</p>
                </TableCell>
              ) : (
                <>
                  <TableCell className="w-1/2">{summary}</TableCell>
                  <TableCell>
                    <Badge
                      color={SENTIMENT_COLORS[sentiment]}
                      className="inline-flex"
                    >
                      {sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => (
                        <Badge key={topic}>{topic}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {nouns.map((noun) => (
                        <Badge key={noun}>{noun}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      color={getConfidenceBadgeColor(confidenceScore)}
                      className="inline-flex"
                    >
                      {confidenceScore}
                    </Badge>
                  </TableCell>
                </>
              )}
            </TableRow>
          ),
        )}
        {isLoading &&
          articles
            .slice(0, articles.length - results.length)
            .map(({ id }, index) => (
              <TableRow key={id} className={ROW_CLASS}>
                <TableCell>{index + results.length + 1}</TableCell>
                <TableCell className="w-1/2">
                  <div className="flex flex-wrap gap-2">
                    <Skeleton classes="w-10 h-3" />
                    <Skeleton classes="w-16 h-3" />
                    <Skeleton classes="w-5 h-3" />
                    <Skeleton classes="w-32 h-3" />
                    <Skeleton classes="w-48 h-3" />
                    <Skeleton classes="w-8 h-3" />
                    <Skeleton classes="w-56 h-3" />
                    <Skeleton classes="w-12 h-3" />
                    <Skeleton classes="w-36 h-3" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton classes="w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton classes="w-16" />
                    <Skeleton classes="w-24" />
                    <Skeleton classes="w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton classes="w-20" />
                    <Skeleton classes="w-32" />
                    <Skeleton classes="w-12" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
