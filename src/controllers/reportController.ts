import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service';

export const createReport = (req: Request, res: Response) => {
	const { text } = req.body;
	const { project_id } = req.params; // Extract from URL params

	console.log('Creating report for project:', project_id); // Debug log

	// Check if the associated project exists
	const project = db.query('SELECT * FROM projects WHERE id = @project_id', {
		project_id,
	});

	console.log('Project found:', project); // Debug log

	if (project.length === 0) {
		return res.status(404).json({ message: 'Project not found' });
	}

	const id = uuidv4();
	db.run(
		'INSERT INTO reports (id, text, projectid) VALUES (@id, @text, @project_id)',
		{ id, text, project_id },
	);

	res.status(201).json({ id, text, project_id });
};
