import { Router } from 'express';
import {
	createReport,
	//getReportsByProject,
	//getReportById,
} from '../controllers/reportController';

const router = Router();

router.post('/', createReport);
//router.get('/', getAllReports);
//router.get('/:id', getReportById);

export default router;
