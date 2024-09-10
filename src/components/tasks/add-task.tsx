"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
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

const MAX_FILE_SIZE = 1024 * 1024 * 8;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Definindo o schema de validação com Zod
const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  due_date: z.date().optional(),
  image: z.any().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
});

type ButtonVariant = "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "mobile";

interface AddTask {
  showIcon?: Boolean;
  showLabel?: Boolean;
  iconSize: number;
  variant: ButtonVariant;
}

export default function AddTask({showIcon, showLabel, iconSize, variant}: AddTask) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    // Adiciona os campos ao formData
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append(
      "due_date",
      values.due_date ? format(values.due_date, "yyyy-MM-dd") : ""
    );

    // Adiciona o campo owner
    formData.append("owner", "1");
    // Adiciona o campo priority
    formData.append("priority", values.priority ?? "Normal");
    // Adiciona o campo status
    formData.append("status", values.status ?? "Todo");

    // Se o campo de imagem contiver um arquivo, adicione-o ao formData
    if (values.image instanceof File) {
      if (values.image.size > MAX_FILE_SIZE) {
        toast("Tamanho máximo do arquivo deve ser de 8MB.", {
          icon: "⚠️",
        });
        return;
      }
      if (!ACCEPTED_IMAGE_MIME_TYPES.includes(values.image.type)) {
        toast("Apenas .jpg, .jpeg, .png, and .webp são aceitos.", {
          icon: "⚠️",
        });
        return;
      }
      formData.append("image", values.image);
    }

    try {
      // Envia o formulário para a API
      const response = await axios.post(
        "http://localhost:8000/api/tasks/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Tarefa adicionada com sucesso", response.data);
      toast.success("Tarefa adicionada com sucesso!");
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1" variant={variant}>
          {showIcon && <PlusCircle size={iconSize} />}
          {showLabel && 'Adicionar um Job'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar um novo Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        field.onChange(file); // Atualiza o valor do campo com o arquivo selecionado
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
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Média" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Pendente" />
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
            <Button type="submit">Enviar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
