"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, PlusCircle, SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const MAX_FILE_SIZE = 1024 * 1024 * 16;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FormSchema = z.object({
  title: z.string().nonempty("Título é obrigatório"),
  description: z.string().nonempty("Descrição é obrigatória"),
  due_date: z.date().optional(),
  image: z.any().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
});

interface UpdateTaskProps {
  taskId: number;
  priority: string;
  status: string;
  showIcon?: Boolean;
  showLabel?: Boolean;
}

export default function UpdateTask({
  taskId,
  priority,
  status,
  showIcon,
  showLabel,
}: UpdateTaskProps) {
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    // Fetch existing task data to populate the form
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tasks/${taskId}/`
        );
        const task = response.data;

        // Populate the form with fetched task data
        form.reset({
          title: task.title,
          description: task.description,
          due_date: task.due_date ? parseISO(task.due_date) : undefined,
          image: null, // The image field should be set to null initially
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch task data", error);
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, form]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append(
      "due_date",
      values.due_date ? format(values.due_date, "yyyy-MM-dd") : ""
    );
    formData.append("owner", "1");
    // Adiciona o campo priority
    formData.append("priority", values.priority ?? "Normal");
    // Adiciona o campo status
    formData.append("status", values.status ?? "Todo");

    if (values.image instanceof File) {
      if (values.image.size > MAX_FILE_SIZE) {
        alert("Max image size is 16MB.");
        return;
      }
      if (!ACCEPTED_IMAGE_MIME_TYPES.includes(values.image.type)) {
        alert("Only .jpg, .jpeg, .png, and .webp formats are supported.");
        return;
      }
      formData.append("image", values.image);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/tasks/${taskId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Task updated successfully", response.data);
      toast.success("Tarefa alterada com sucesso!");
      // Recarregar a pagina
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="flex gap-2 text-sm p-2 cursor-pointer w-full text-left">
        <div className="w-auto p-2 text-sm hover:bg-slate-100 transition-all">
          {showIcon && <SquarePen size={16} />}
          {showLabel && "Editar"}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de entrega</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Escolha a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row justify-between">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={
                              priority === "Normal"
                                ? "Média"
                                : priority === "low"
                                ? "Baixa"
                                : priority === "high"
                                ? "Alta"
                                : "Escolha a prioridade"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Média</SelectItem>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder={
                              status === "Todo"
                                ? "Pendente"
                                : status === "Em andamento"
                                ? "Em andamento"
                                : status === "Finalizado"
                                ? "Finalizado"
                                : "Escolha o status"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Todo">Pendente</SelectItem>
                          <SelectItem value="Em andamento">
                            Em andamento
                          </SelectItem>
                          <SelectItem value="Finalizado">Finalizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
