import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    id: String,
    title: String,
    status: Boolean,
    timeToComplete: String,
    timeAdded: String,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
