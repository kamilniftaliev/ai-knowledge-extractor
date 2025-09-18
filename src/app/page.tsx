"use client";

import { TabItem, Tabs } from "flowbite-react";
import { PiArticleNyTimesFill } from "react-icons/pi";
import { FaHistory } from "react-icons/fa";
import { NewContent, PastAnalyses } from "@/components";

export default function Home() {
  return (
    <main className="mx-auto flex w-full py-36 xl:max-w-3/4">
      <Tabs aria-label="Tabs with icons">
        <TabItem active title="New Articles" icon={PiArticleNyTimesFill}>
          <NewContent />
        </TabItem>
        <TabItem title="Past Analyses" icon={FaHistory}>
          <PastAnalyses />
        </TabItem>
      </Tabs>
    </main>
  );
}
