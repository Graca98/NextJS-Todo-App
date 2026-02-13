"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const AddTask = ({ task, setTask, handleSubmit, taskDate, setTaskDate }) => {
  const getMinDateToday = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  return (
    <Card className="p-4 mb-6 bg-card border border-border">
      <div className="flex items-center gap-3">
        <Checkbox disabled />

        <div className="flex flex-col md:flex-row gap-3 flex-1">
          <Input
            placeholder="Přidat úkol"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1"
          />

          <Input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            min={getMinDateToday()}
            className="w-40"
          />
        </div>

        <Button onClick={handleSubmit} variant="secondary">
          Přidat
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;
