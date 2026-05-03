import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
  try {
    if (!name) {
      throw new Error("Name is required");
    }

    if (!userId) {
      throw new Error("User Id is required");
    }
    try {
      const newProject = await projectModel.create({
        name,
        users: [userId],
      });

      return newProject;
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error code in MongoDB
        throw new Error("Project name already exists");
      }
      throw error;
    }
    return newProject;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllProjectsByUserId = async ({ userId }) => {
  try {
    if (!userId) {
      throw new Error("User Id is required");
    }
    const allUserProjects = await projectModel.find({ users: userId });
    console.log(allUserProjects);
    return allUserProjects;
  } catch (error) {
    throw new Error(error);
  }
};

export const addUsersToProjects = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("Project Id is required");
  }

  if (!users) {
    throw new Error("Users are required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid Project Id");
  }
  if (!userId) {
    throw new Error("User Id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user Id");
  }

  users.forEach((user) => {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      throw new Error(`Invalid User Id: ${user}`);
    }
  });

  const project = await projectModel.findOne({
    _id: projectId,
    users: userId,
  });

  if (!project) {
    throw new Error("user not belonged to this project");
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    {
      _id: projectId,
    },
    {
      $addToSet: {
        users: { $each: users },
      },
    },
    {
      new: true,
    }
  );

  return updatedProject;
};

export const getProjectById = async ({ projectId }) => {
  try {
    if (!projectId) {
      throw new Error("Project Id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid Project Id");
    }
    const project = await projectModel
      .findOne({ _id: projectId })
      .populate("users");
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateFileTree = async ({ projectId, fileTree }) => {
  try {
    if (!projectId) {
      throw new Error("Project Id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid Project Id");
    }

    if (!fileTree) {
      throw new Error("File Tree is required");
    }
    const project = await projectModel.findOneAndUpdate(
      { _id: projectId },
      {
        fileTree,
      },
      {
        new: true,
      }
    );

    return project;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteProject = async ({ projectId, userId }) => {
  try {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error("Invalid Project Id");
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User Id");
    }

    const project = await projectModel.findOne({
      _id: projectId,
      users: userId
    });

    if (!project) {
      throw new Error("Project not found or user not authorized");
    }

    await projectModel.findByIdAndDelete(projectId);
    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};
