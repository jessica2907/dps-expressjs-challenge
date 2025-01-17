import { Router } from 'express';
import {
	createReport,
	getAllReports,
	getReportById,
	updateReport,
} from '../controllers/reportController';

const router = Router();

router.post('/', createReport);
router.get('/', getAllReports);
router.get('/:id', getReportById);
router.put('/:id', updateReport);

export default router;
