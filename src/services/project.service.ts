// Utils
import { statusCodeErrors } from "../utils/customErrors.util";
// Repositories
import { insertProject } from "../repositories/project.repository";
// Types
import { authResponseType } from "../types/responses.type";

export const createProject = async (name: string, description: string, tags: Array<string>, userID: string): Promise<authResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (name === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const inProject: any = await insertProject({
    owner: userID,
    name: name,
    description: description,
    tags: tags,
    createdAt: new Date()
  });
  if (!inProject) throw new statusCodeErrors("An error occurred while creating the project.", 401);

  return {
    response: {
      message: "The project has been created.",
    },
    userId: userID
  };

};