import React from "react";
import UserIdent from "./user_ident";

export default function Header() {
  return (
    <div className="fixed top-0 z-10 bg-white w-full h-24 shadow-md">
      <div className="flex h-full justify-between items-center px-4 max-w-[1292px] mx-auto">
        <UserIdent />
      </div>
    </div>
  );
}
