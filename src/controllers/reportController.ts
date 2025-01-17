import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service';

// Create a report
export const createReport = (req: Request, res: Response) => {
	const { text, project_id } = req.body; // Extract 'text' and 'project_id' from request body

	// Check if the associated project exists
	const project = db.query('SELECT * FROM projects WHERE id = @project_id', {
		project_id,
	});

	// If project doesn't exist, return an error
	if (project.length === 0) {
		return res.status(404).json({ message: 'Project not found' });
	}

	// Create a new report
	const id = uuidv4();
	db.run(
		'INSERT INTO reports (id, text, projectid) VALUES (@id, @text, @project_id)',
		{ id, text, project_id },
	);

	// Send a success response with the newly created report details
	res.status(201).json({ id, text, project_id });
};

// Get all reports
export const getAllReports = (req: Request, res: Response) => {
	const reports = db.query('SELECT * FROM reports');
	res.status(200).json(reports);
};

// Get a report by ID
export const getReportById = (req: Request, res: Response) => {
	const { id } = req.params;
	const report = db.query('SELECT * FROM reports WHERE id = @id', { id });

	if (report.length === 0) {
		return res.status(404).json({ message: 'Report not found' });
	}

	res.status(200).json(report[0]);
};
