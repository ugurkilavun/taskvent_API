
export type taskMemberType = {
  firstname: string;
  lastname: string;
  username: string;
}[];

export type taskType = {
  taskID: string;
  description: string;
  startDate: any;
  endDate: any;
  priority: string;
  members: taskMemberType;
  status: string;
}[];

export type ownedProjectsType = {
  projectID: string;
  title: string;
  description: string;
  tags: [string];
  createdAt: Date;
}[];

export type memberProjectsType = {
  projectID: string;
  title: string;
  description: string;
  tags: [string];
  createdAt: Date;
}[];

export type authResponseType = {
  response: {
    message: string;
    access_token?: string;
    refresh_token?: string;
    projectDatas?: {
      project?: {
        projectID: string;
        title: string;
        description: string;
        tags: [string];
        createdAt: Date;
      },
      tasks?: taskType;
    },
    ownedProjects?: ownedProjectsType,
    memberProjects?: memberProjectsType,
  };
  userId: string;
  HTTPStatusCode: number;
};