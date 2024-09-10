"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteTask {
  id: number;
  showIcon?: Boolean;
  showLabel?: Boolean;
}

export default function DeleteTask({ id, showIcon, showLabel }: DeleteTask) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/");
  };

  const handleDeleteTask = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/tasks/${id}/`
      );
      console.log("Task deleted successfully", response.data);
      toast.success("Tarefa deletada com sucesso!");
      setTimeout(() => {
        window.location.reload();
        handleNavigate();
      }, 1000);
    } catch (error) {
      toast.error("Houve um erro ao tentar deletar essa tarefa.");
      console.log(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="flex gap-2 text-sm p-2 cursor-pointer w-full text-left">
        <div className="w-auto p-2 text-sm hover:bg-slate-100 transition-all">
          {showIcon && <Trash2 size={16} />}
          {showLabel && "Deletar task"}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você tem certeza que quer excluir?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
            tarefa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTask}
            className="bg-red-500 hover:bg-red-600"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
