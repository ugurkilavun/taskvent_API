// Models
import task from "../models/task.model";
// Types
import { taskType } from "../types/task.type";

export const insertTask = async (DATA: taskType): Promise<any> => {
  return await task.insertOne({
    projectID: DATA.projectID,
    description: DATA.description,
    startDate: DATA.startDate,
    endDate: DATA.endDate,
    priority: DATA.priority,
    members: DATA.members,
    status: DATA.status,
  });
};

export const findTaskByUserID = async (projectID: string, members: [string]): Promise<any> => {
  return await task.find({
    projectID: projectID,
    members: { $in: members }
  }, {
    projectID: 0
  });
};

export const findTaskForRoot = async (projectID: string): Promise<any> => {
  return await task.find({
    projectID: projectID
  });
};

export const findTaskByID = async (taskID: string): Promise<any> => {
  return await task.find({
    _id: taskID
  });
};