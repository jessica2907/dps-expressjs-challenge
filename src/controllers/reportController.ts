import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service';

// Create a report
export const createReport = (req: Request, res: Response) => {
	const { text, project_id } = req.body;

	// Check if the associated project exists
	const project = db.query('SELECT * FROM projects WHERE id = @project_id', {
		project_id,
	});
	if (project.length === 0) {
		return res.status(404).json({ message: 'Project not found' });
	}

	const id = uuidv4();
	db.run(
		'INSERT INTO reports (id, text, project_id) VALUES (@id, @text, @project_id)',
		{ id, text, project_id },
	);

	res.status(201).json({ id, text, project_id });
};
