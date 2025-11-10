// Models
import project from "../models/project.model";
// Types
import { projectType } from "../types/projects.type";

export const insertProject = async (DATA: projectType): Promise<any> => {
  return await project.insertOne({
    owner: DATA.owner,
    name: DATA.name,
    description: DATA.description,
    tags: DATA.tags,
    createdAt: DATA.createdAt
  });
};

export const findProject = async (token: string): Promise<any> => {
  return await project.findOne({
    token: token,
  });
};

export const updateProject = async (id: string, token: string): Promise<any> => {
  return await project.updateOne({
    id: id,
    token: token,
  }, { $set: { used: true } });
};