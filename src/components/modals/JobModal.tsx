"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useJobModal from "@/hooks/useJobModal";
import { Task } from "@/types/types";
import axios from "axios";
import Modal from "./modal";
import Image from "next/image";
import { FileImage } from "lucide-react";
import UpdateTask from "../tasks/edit-task";
import DeleteTask from "../tasks/delete-task";
import DueTime from "../tasks/due-time";
import { Badge } from "../ui/badge";

export default function JobModal() {
  const router = useRouter();
  const jobModal = useJobModal();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      if (!jobModal.taskId) return; // Verifica se há um ID de tarefa selecionado

      try {
        const response = await axios.get(
          `http://localhost:8000/api/tasks/${jobModal.taskId}`
        );
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }

    fetchTask();
  }, [jobModal.taskId]); // Reexecuta quando o ID da tarefa mudar

  if (!task) {
    return null
  }

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
        <div className="flex flex-col">
          {task.image ? (
            <div className="w-[250px] h-[250px] overflow-hidden">
              <Image
                src={task.image}
                alt="Imagem da tarefa"
                width={250}
                height={250}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          ) : (
            <div className="w-[250px] h-[250px] max-w-md bg-gray-200 flex items-center justify-center rounded-t-md">
              <FileImage size={32} />
            </div>
          )}
        </div>
        <div
          key={task.id}
          className="pr-0 md:pl-4 w-full flex flex-col justify-between"
        >
          <div className="flex flex-col">
            <h2 className="text-xl text-black font-medium break-all mb-1">
              {task.title}
            </h2>
            <div className="flex flex-row gap-2 mb-2">
              <Badge
                variant={
                  task.priority === "Normal"
                    ? "pendente"
                    : task.priority === "low"
                    ? "andamento"
                    : task.priority === "high"
                    ? "finalizado"
                    : "default"
                }
              >
                {task.priority === "Normal"
                  ? "Média"
                  : task.priority === "low"
                  ? "Baixa"
                  : task.priority === "high"
                  ? "Alta"
                  : "Não definido"}
              </Badge>
              <Badge
                variant={
                  task.status === "Todo"
                    ? "pendente"
                    : task.status === "Em andamento"
                    ? "andamento"
                    : task.status === "Finalizado"
                    ? "finalizado"
                    : "default"
                }
              >
                {task.status === "Todo" ? "Pendente" : task.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 my-2">
              Data de Lançamento:{" "}
              {task.created_at
                ? new Date(task.created_at).toLocaleDateString()
                : "N/A"}
            </p>

            <p className="text-sm text-gray-600 mt-2 min-h-[80px]">
              {task.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  let footerContent = (
    <div className="flex justify-between">
      <p className="text-sm text-[#5F33E2] font-medium mt-1">
        Prazo de entrega:{" "}
        {task.due_date
          ? new Date(task.due_date).toLocaleDateString()
          : "Nenhum"}
      </p>
      <div className="flex flex-row justify-between w-14">
        <UpdateTask
          taskId={task.id}
          priority={task.priority}
          status={task.status}
          showIcon={true}
        />
        <DeleteTask id={task.id} showIcon={true} showLabel={false} />
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={jobModal.isOpen}
      title={task.title}
      actionLabel=""
      onClose={jobModal.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
