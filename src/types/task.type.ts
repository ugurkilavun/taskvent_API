export type taskType = {
  projectID: string,
  description: string,
  startDate: Date,
  endDate: Date,
  priority: string,
  members: [string],
  status: string,
};