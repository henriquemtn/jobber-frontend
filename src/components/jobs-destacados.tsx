"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "@/types/types";
import Job from "./job";
import {
  Carousel,
  CarouselContent
} from "./ui/carousel";
import { Button } from "./ui/button";

export default function JobsDestacados() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get("http://localhost:8000/api/tasks/");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className="max-w-[1292px] mx-auto px-3 mt-28">
      <h1 className="md:text-[20px] font-bold mb-3">Jobs Destacados 📌</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : tasks.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {tasks.map((task) => (
              <Job key={task.id} {...task} />
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="">
          <p className="mb-2">Você ainda não destacou nenhum Job, que tal adicionar um.</p>
          <Button>Destacar Job</Button>
        </div>
      )}
    </div>
  );
}
