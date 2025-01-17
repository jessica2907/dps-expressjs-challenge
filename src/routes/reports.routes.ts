import { Router } from 'express';
import { createReport } from '../controllers/reportController';

const router = Router();

router.post('/:project_id/reports', createReport);

export default router;
