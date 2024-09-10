import Header from "@/components/header";
import JobsDestacados from "@/components/jobs-destacados";
import JobsTable from "@/components/jobs-table";
import TabBar from "@/components/tab-bar";
import React from "react";

export default function Home() {
  return (
    <>
      <Header />
      <JobsDestacados />
      <JobsTable />
      <TabBar />
    </>
  );
}
