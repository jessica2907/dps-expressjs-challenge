import { Router } from 'express';
import {
	createReport,
	getAllReports,
	getReportById,
	updateReport,
	deleteReport,
	getReportsWithRepeatedWords,
} from '../controllers/reportController';

const router = Router();

router.post('/', createReport);
router.get('/', getAllReports);

// repeated-words has to be before /:id because express evaluates routes in the order they are defined,
// otherwise it can be mistaken as /:id.
router.get('/repeated-words', getReportsWithRepeatedWords);

router.get('/:id', getReportById);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;
