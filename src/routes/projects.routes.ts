import { Router } from 'express';
import {
	createProject,
	getAllProjects,
	getProjectById,
	updateProject,
	deleteProject,
} from '../controllers/projectController';
import reportsRoutes from './reports.routes';

const router = Router();

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Nested report routes
router.use('/:project_id/reports', reportsRoutes);

export default router;
