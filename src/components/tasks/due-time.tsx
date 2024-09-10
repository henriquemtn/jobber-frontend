import React from "react";
import { differenceInDays } from "date-fns";
import { Task } from "@/types/types";
import { Badge } from "../ui/badge";

interface DueTimeProps {
    due_date: string
}

export default function DueTime({ due_date }: DueTimeProps) {
  const today = new Date();
  const dueDate = due_date ? new Date(due_date) : null;
  const daysRemaining = dueDate ? differenceInDays(dueDate, today) : null;

  let badgeVariant: "default" | "destructive" | "secondary" | "outline" | null =
    "default";
  let badgeText = "";

  if (daysRemaining !== null) {
    if (daysRemaining <= 0) {
      badgeVariant = "destructive";
      badgeText = "Atrasado";
    } else if (daysRemaining < 3) {
      badgeVariant = "destructive";
      badgeText = `${daysRemaining} dias`;
    } else {
      badgeVariant = "default";
      badgeText = `${daysRemaining} dias`;
    }
  } else {
    return null
  }

  return <Badge variant={badgeVariant}>{badgeText}</Badge>;
}
