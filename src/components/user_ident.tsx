import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserIdent() {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>HS</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <p className="text-[#13151d] font-medium text-[16px]">
          Olá, Henrique Silveira
        </p>
        <p className="text-[#532CC7] text-[14px]">AVANTI - Estagiário</p>
      </div>
    </div>
  );
}
