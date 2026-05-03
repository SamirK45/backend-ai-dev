import {Router} from 'express';
import * as projectController from '../controllers/project.controller.js';
import {body} from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';
const router = Router();

router.post('/create',authMiddleware.authUser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
)

router.get('/all',authMiddleware.authUser,projectController.getProjects)

router.put('/add-user',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array with at least one user').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject)

router.get('/get-project/:projectId',authMiddleware.authUser,projectController.getProjectById)

router.put(
    '/update-fileTree',
    authMiddleware.authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree must be an object'),
    projectController.updateFileTree
    

)

router.delete('/delete/:projectId', 
    authMiddleware.authUser,
    projectController.deleteProject
);

export default router;



