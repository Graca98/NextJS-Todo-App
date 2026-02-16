"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PiCalendarDots } from "react-icons/pi";
import { FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";

export default function TaskCard({
  title,
  status,
  timeToComplete,
  change,
  deleteTask,
  editTask,
  isEditing,
  editValue,
  setEditValue,
  handleEditSave,
  handleEditCancel,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("cs-CZ");
  };

  return (
    <Card
      className={`px-3 md:px-4 py-2 md:py-2 border border-border rounded-none md:rounded-md bg-card hover:bg-muted/40 transition-colors text-sm ${
        status ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <Checkbox checked={status} onCheckedChange={change} />

        <div className="flex flex-col md:flex-row md:items-center flex-1 gap-2">
          {isEditing ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave();
                if (e.key === "Escape") handleEditCancel();
              }}
              className="bg-background border border-border rounded-none md:rounded-md px-2 py-1 text-sm w-full"
            />
          ) : (
            <span className={`flex-1 ${status ? "line-through" : ""}`}>
              {title}
            </span>
          )}

          {timeToComplete && (
            <span className="flex items-center gap-2 text-muted-foreground text-sm">
              <PiCalendarDots />
              {formatDate(timeToComplete)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="icon" variant="ghost" onClick={handleEditSave}>
                <FiCheck className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleEditCancel}>
                <FiX className="w-4 h-4 text-destructive" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="ghost" onClick={editTask}>
                <FiEdit2 className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={deleteTask}>
                <FiTrash2 className="w-4 h-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
