// Utils
import { statusCodeErrors } from "../utils/customErrors.util";
// Repositories
import { insertProject, findOneProject, findProjectsByUserID } from "../repositories/project.repository";
import { insertTeam, findTeamByTeamID, findUserFromTeams } from "../repositories/team.repository";
import { findTaskByUserID, findTaskForRoot } from "../repositories/task.repository";
import { findById_flu } from "../repositories/user.repository";
// import { findById_flu } from "../repositories/user.repository";
// Types
import { authResponseType, taskMemberType, taskType, ownedProjectsType, memberProjectsType } from "../types/responses.type";

export const createProject = async (userID: string, teamID: Array<string>, title: string, description: string, tags: Array<string>): Promise<authResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (title === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (teamID !== undefined) {
    // * teamID.length === 1
    if (teamID.length === 1) {
      const fiTeamByTeamID: any = await findTeamByTeamID(teamID[0]);
      if (!fiTeamByTeamID) throw new statusCodeErrors("Team not found.", 404);
      if (fiTeamByTeamID.owner.toString() !== userID) throw new statusCodeErrors("Cannot add this team. You must be the team owner.", 401);
    };

    // * teamID.length > 1
    if (teamID.length > 1) {
      for (let teamIndex = 0; teamIndex <= teamID.length - 1; teamIndex++) {
        const fiTeamByTeamID: any = await findTeamByTeamID(teamID[teamIndex]);
        if (!fiTeamByTeamID) throw new statusCodeErrors("Team not found.", 404);
        if (fiTeamByTeamID.owner.toString() !== userID) throw new statusCodeErrors("Cannot add this team. You must be the team owner.", 401);
      };
    };
  };

  const inProject: any = await insertProject({
    owner: userID,
    teamID: teamID,
    title: title,
    description: description,
    tags: tags,
    createdAt: new Date()
  });
  if (!inProject) throw new statusCodeErrors("Project creation error.", 401);

  return {
    response: {
      message: "Project created.",
    },
    userId: userID,
    HTTPStatusCode: 201
  };

};

// * Single
export const getProject = async (userID: string, projectID: string): Promise<authResponseType> => {

  if (userID === undefined) throw new statusCodeErrors("Incomplete data.", 400);
  if (projectID === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const fiOneProject: any = await findOneProject(projectID);
  if (!fiOneProject) throw new statusCodeErrors("Project not found.", 404);

  // ! Task Functions
  // * Tasks number < 1
  const hasNoTasks = (): authResponseType => {
    return {
      response: {
        message: "Task not found.",
        projectDatas: {
          project: {
            projectID: fiOneProject._id,
            title: fiOneProject.title,
            description: fiOneProject.title,
            tags: fiOneProject.tags,
            createdAt: fiOneProject.createdAt,
          }
        },
      },
      userId: userID,
      HTTPStatusCode: 200
    };
  };

  // * Tasks Number > 1
  const hasMultipleTasks = async (value: any): Promise<void> => {
    for (let taskIndex = 0; taskIndex <= value.length - 1; taskIndex++) {

      // ? Members === 1
      if (value[taskIndex].members.length === 1) {
        const taskMembers: any = await findById_flu(value[taskIndex].members);

        taskDATAS.push({
          taskID: value[taskIndex]._id,
          description: value[taskIndex].description,
          startDate: value[taskIndex].startDate,
          endDate: value[taskIndex].endDate,
          priority: value[taskIndex].priority,
          members: taskMembers === null ? [{
            firstname: "null",
            lastname: "null",
            username: "nullnull"
          }] : [{
            firstname: taskMembers.firstname,
            lastname: taskMembers.lastname,
            username: taskMembers.username
          }],
          status: value[taskIndex].status,
        });

      }

      // ? Members > 1
      else if (value[taskIndex].members.length > 1) {

        const tempTaskMemberDATAS: taskMemberType = [];
        for (let memberIndex = 0; memberIndex <= value[taskIndex].members.length - 1; memberIndex++) {
          const taskMembers: any = await findById_flu(value[taskIndex].members[memberIndex]);

          if (taskMembers !== null) tempTaskMemberDATAS.push({
            firstname: taskMembers.firstname,
            lastname: taskMembers.lastname,
            username: taskMembers.username
          });
          else tempTaskMemberDATAS.push({
            firstname: "null",
            lastname: "null",
            username: "nullnull"
          }); // User is not found
        }

        taskDATAS.push({
          taskID: value[taskIndex]._id,
          description: value[taskIndex].description,
          startDate: value[taskIndex].startDate,
          endDate: value[taskIndex].endDate,
          priority: value[taskIndex].priority,
          members: tempTaskMemberDATAS,
          status: value[taskIndex].status,
        });

      }

      // ? Members: unknown
      else throw new statusCodeErrors("Task member error.", 400);
    }
  };

  // * Tasks number === 1
  const hasSingleTask = async (value: any): Promise<void> => {
    // ? Members === 1
    if (value[0].members.length === 1) {
      const taskMembers: any = await findById_flu(value[0].members);

      taskDATAS.push({
        taskID: value[0]._id,
        description: value[0].description,
        startDate: value[0].startDate,
        endDate: value[0].endDate,
        priority: value[0].priority,
        members: taskMembers === null ? [{
          firstname: "null",
          lastname: "null",
          username: "nullnull"
        }] : [{
          firstname: taskMembers.firstname,
          lastname: taskMembers.lastname,
          username: taskMembers.username
        }],
        status: value[0].status,
      });

    }

    // ? Members > 1
    else if (value[0].members.length > 1) {

      const tempTaskMemberDATAS: taskMemberType = [];

      for (let memberIndex = 0; memberIndex <= value[0].members.length - 1; memberIndex++) {
        const taskMembers: any = await findById_flu(value[0].members[memberIndex]);

        if (taskMembers !== null) tempTaskMemberDATAS.push({
          firstname: taskMembers.firstname,
          lastname: taskMembers.lastname,
          username: taskMembers.username
        });
        else tempTaskMemberDATAS.push({
          firstname: "null",
          lastname: "null",
          username: "nullnull"
        }); // User is not found
      }

      taskDATAS.push({
        taskID: value[0]._id,
        description: value[0].description,
        startDate: value[0].startDate,
        endDate: value[0].endDate,
        priority: value[0].priority,
        members: tempTaskMemberDATAS,
        status: value[0].status,
      });

    }

    // ? Members: unknown
    else throw new statusCodeErrors("Task member error.", 400);

  };

  const taskDATAS: taskType = [];

  if (fiOneProject.teamID.length === 1) {
    const fiTeamByTeamID: any = await findTeamByTeamID(fiOneProject.teamID[0]);

    // * Owner
    if (fiTeamByTeamID.owner.toString() === userID) {

      const fiTaskRoot: any = await findTaskForRoot(projectID);

      // ? Tasks number < 1
      if (fiTaskRoot.length < 1) return hasNoTasks();

      // ? Tasks Number > 1
      if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

      // ? Tasks number === 1
      if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
    }

    // * Project manager
    else if (fiTeamByTeamID.projectManagers.includes(userID)) {

      const fiTaskRoot: any = await findTaskForRoot(projectID);

      // ? Tasks number < 1
      if (fiTaskRoot.length < 1) return hasNoTasks()

      // ? Tasks Number > 1
      if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

      // ? Tasks number === 1
      if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);

    }

    // * Team leader
    else if (fiTeamByTeamID.teamLeaders.includes(userID)) {

      const fiTaskRoot: any = await findTaskForRoot(projectID);

      // ? Tasks number < 1
      if (fiTaskRoot.length < 1) return hasNoTasks();

      // ? Tasks Number > 1
      if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

      // ? Tasks number === 1
      if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
    }

    // * Member
    else if (fiTeamByTeamID.members.includes(userID)) {

      const fiTaskByUserID: any = await findTaskByUserID(projectID, [userID]);

      // ? Tasks number < 1
      if (fiTaskByUserID.length < 1) return hasNoTasks();

      // ? Tasks Number > 1
      if (fiTaskByUserID.length > 1) await hasMultipleTasks(fiTaskByUserID);

      // ? Tasks number === 1
      if (fiTaskByUserID.length === 1) await hasSingleTask(fiTaskByUserID);
    }
    else {
      throw new statusCodeErrors("Unauthorized access.", 401);
    }

  };

  if (fiOneProject.teamID.length > 1) {

    let isMember: boolean = false;
    let tempRole: "owner" | "projectManagers" | "teamLeaders" | "member";

    for (let teamIndex = 0; teamIndex <= fiOneProject.teamID.length - 1; teamIndex++) {
      const fiTeamByTeamID: any = await findTeamByTeamID(fiOneProject.teamID[teamIndex]);
      // * Owner
      if (fiTeamByTeamID.owner.toString() === userID) {
        isMember = true;
        tempRole = "owner";
        break;
      };

      // * Project manager
      if (fiTeamByTeamID.projectManagers.includes(userID)) {
        isMember = true;
        tempRole = "projectManagers";
        break;
      };

      // * Team leader
      if (fiTeamByTeamID.teamLeaders.includes(userID)) {
        isMember = true;
        tempRole = "teamLeaders";
        break;
      };

      // * Member
      if (fiTeamByTeamID.members.includes(userID)) {
        isMember = true;
        tempRole = "member";
        break;
      };

    };

    if (!isMember) throw new statusCodeErrors("Unauthorized access.", 401);

    // * Owner
    if (tempRole === "owner") {

      const fiTaskRoot: any = await findTaskForRoot(projectID);

      // ? Tasks number < 1
      if (fiTaskRoot.length < 1) return hasNoTasks();

      // ? Tasks Number > 1
      if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

      // ? Tasks number === 1
      if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
    }

    // * Project manager
    else if (tempRole === "projectManagers") {

      const fiTaskRoot: any = await findTaskForRoot(projectID);

      // ? Tasks number < 1
      if (fiTaskRoot.length < 1) return hasNoTasks()

      // ? Tasks Number > 1
      if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

      // ? Tasks number === 1
      if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);

    }

    // * Team leader
    else if (tempRole === "teamLeaders") {

      const fiTaskRoot: any = await findTaskForRoot(projectID);

      // ? Tasks number < 1
      if (fiTaskRoot.length < 1) return hasNoTasks();

      // ? Tasks Number > 1
      if (fiTaskRoot.length > 1) await hasMultipleTasks(fiTaskRoot);

      // ? Tasks number === 1
      if (fiTaskRoot.length === 1) await hasSingleTask(fiTaskRoot);
    }

    // * Member
    else if (tempRole === "member") {

      const fiTaskByUserID: any = await findTaskByUserID(projectID, [userID]);

      // ? Tasks number < 1
      if (fiTaskByUserID.length < 1) return hasNoTasks();

      // ? Tasks Number > 1
      if (fiTaskByUserID.length > 1) await hasMultipleTasks(fiTaskByUserID);

      // ? Tasks number === 1
      if (fiTaskByUserID.length === 1) await hasSingleTask(fiTaskByUserID);
    }
    else {
      throw new statusCodeErrors("Unauthorized access.", 401);
    }

  };

  if (fiOneProject.teamID.length < 1) {
    if (fiOneProject.owner.toString() !== userID) throw new statusCodeErrors("Unauthorized access.", 401);
  };

  return {
    response: {
      message: "Project found.",
      projectDatas: {
        project: {
          projectID: fiOneProject._id,
          title: fiOneProject.title,
          description: fiOneProject.title,
          tags: fiOneProject.tags,
          createdAt: fiOneProject.createdAt,
        },
        tasks: taskDATAS.length >= 1 && taskDATAS
      },
    },
    userId: userID,
    HTTPStatusCode: 200
  };

};

// * Multi
export const getProjects = async (userID: string): Promise<authResponseType> => {
  const fiProjectsByUserID: any = await findProjectsByUserID(userID);
  const fiUserFromTeams: any = await findUserFromTeams(userID);

  // ownedProjects
  // memberProjects
  console.log("Owned Projects:");
  console.log(fiProjectsByUserID);

  console.log("------------------------------------------------------");

  console.log("Member Projects:");
  console.log(fiUserFromTeams);
  // ! Here

  const ownedProjectsDATA: ownedProjectsType = [];
  const memberProjectsDATA: memberProjectsType = [];

  if (fiProjectsByUserID.length > 1) {
    for (let projectIndex = 0; projectIndex <= fiUserFromTeams.length - 1; projectIndex++) {
      ownedProjectsDATA.push({
        projectID: fiProjectsByUserID[projectIndex]._id,
        title: fiProjectsByUserID[projectIndex].title,
        description: fiProjectsByUserID[projectIndex].title,
        tags: fiProjectsByUserID[projectIndex].tags,
        createdAt: fiProjectsByUserID[projectIndex].createdAt,
      });
    }
  };

  if (fiProjectsByUserID.length === 1) {
    ownedProjectsDATA.push({
      projectID: fiProjectsByUserID[0]._id,
      title: fiProjectsByUserID[0].title,
      description: fiProjectsByUserID[0].title,
      tags: fiProjectsByUserID[0].tags,
      createdAt: fiProjectsByUserID[0].createdAt,
    });
  }
  // !SSSSSSSSSSSSSSSSSSSSSSSSSS

  if (fiUserFromTeams.length > 1) {
    for (let projectIndex = 0; projectIndex <= fiUserFromTeams.length - 1; projectIndex++) {
      memberProjectsDATA.push({
        projectID: fiUserFromTeams[projectIndex]._id,
        title: fiUserFromTeams[projectIndex].title,
        description: fiUserFromTeams[projectIndex].title,
        tags: fiUserFromTeams[projectIndex].tags,
        createdAt: fiUserFromTeams[projectIndex].createdAt,
      });
    }
  };

  if (fiUserFromTeams.length === 1) {
    memberProjectsDATA.push({
      projectID: fiUserFromTeams[0]._id,
      title: fiUserFromTeams[0].title,
      description: fiUserFromTeams[0].title,
      tags: fiUserFromTeams[0].tags,
      createdAt: fiUserFromTeams[0].createdAt,
    });
  };

  return {
    response: {
      message: "Project found.",
      ownedProjects: ownedProjectsDATA,
      memberProjects: memberProjectsDATA
    },
    userId: userID,
    HTTPStatusCode: 200
  };

};