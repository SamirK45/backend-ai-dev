import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import userModel from "../models/user.model.js";
import { validationResult } from 'express-validator';


export const createProject = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    try{
  
        const {name} = req.body;
        console.log(name);

        const loggedInUser = await userModel.findOne({email: req.user.email});
    
        const userId = loggedInUser._id;
    
        const newProject = await projectService.createProject({name, userId});
    
    
    
        res.status(201).json(newProject);
    }
    catch(error){
        console.log(error);
        res.status(400).send(error.message);
    }



}


export const getProjects = async (req, res) => {

    const validationErrors = validationResult(req);
  
    try {
        const loggedInUser = await userModel.findOne({email: req.user.email})

        const getAllProject = await projectService.getAllProjectsByUserId(
            {userId: loggedInUser._id});

            return res.status(200).json({projects:getAllProject});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }

}

export const addUserToProject = async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
        const {projectId,users} = req.body;
        const loggedInUser = await userModel.findOne({email: req.user.email});

        const project = await projectService.addUsersToProjects({
            projectId,
            users,
            userId: loggedInUser._id
        });

           return res.status(200).json({project});

    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
}

export const getProjectById = async (req, res) => {
    try {
        const {projectId} = req.params;
        
        const project = await projectService.getProjectById({projectId});
        return res.status(200).json({project});
    }
    catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
}

export const updateFileTree =async (req, res) =>{
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }
    try{
        const {projectId, fileTree} = req.body;
        const project = await projectService.updateFileTree({projectId, fileTree});
        return res.status(200).json({project});
        }
        catch(error){
            console.log(error);
            res.status(400).json({error: error.message});
            }

}

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const loggedInUser = await userModel.findOne({email: req.user.email});
        
        const result = await projectService.deleteProject({
            projectId,
            userId: loggedInUser._id
        });
        
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error.message});
    }
};