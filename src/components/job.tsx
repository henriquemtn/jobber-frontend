import { Task } from "@/types/types";
import { Calendar, FileImage } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { CarouselItem } from "./ui/carousel";
import { format } from "date-fns";
import DueTime from "./tasks/due-time";
import useJobModal from "@/hooks/useJobModal";

export default function Job({
  id,
  title,
  description,
  created_at,
  image,
  due_date,
}: Task) {

  const jobModal = useJobModal();


  return (
    <CarouselItem onClick={() => jobModal.onOpen(id)} className="pl-1 min-[420px]:basis-1/2 md:basis-1/3 lg:basis-1/5 hover:cursor-pointer">
      <div className="p-0 md:p-1">
        <Card className="flex flex-col justify-between h-[345px]">
          {image ? (
            <div className="w-full h-[200px] overflow-hidden">
              <Image
                src={image}
                alt="Imagem da tarefa"
                width={200}
                height={200}
                style={{ objectFit: "cover" }}
                className="object-cover w-full h-full rounded-t-md"
              />
            </div>
          ) : (
            <div className="h-[200px] w-full bg-gray-200 flex items-center justify-center rounded-t-md">
              <FileImage size={32} />
            </div>
          )}
          <CardContent className="p-3 flex flex-col h-[162px] justify-between">
            <div className="flex flex-col">
              <h1 className="font-bold break-words min-h-[45px] line-clamp-2">{title}</h1>
              <p className="text-sm text-gray-600 mt-2 break-words line-clamp-2">
                {description}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-full bg-slate-200 h-[1px] my-2" />
              <div className="flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <Calendar color="#5F33E2" size={14} />
                  <p className="text-[12px] text-[#5F33E2] font-medium">
                    {format(new Date(created_at), "dd/MM/yyyy")}
                  </p>
                </div>
                {due_date && (
                  <div className="flex gap-1 items-center">
                    <DueTime due_date={due_date} />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  );
}
