import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service';
import { Report } from '../models/report.model';

// Create a report
export const createReport = (req: Request, res: Response) => {
	const { text, project_id } = req.body;

	const project = db.query('SELECT * FROM projects WHERE id = @project_id', {
		project_id,
	}) as Report[];

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
	const reports = db.query('SELECT * FROM reports') as Report[];
	res.status(200).json(reports);
};

// Get a report by ID
export const getReportById = (req: Request, res: Response) => {
	const { id } = req.params;
	const report = db.query('SELECT * FROM reports WHERE id = @id', {
		id,
	}) as Report[];

	if (report.length === 0) {
		return res.status(404).json({ message: 'Report not found' });
	}

	res.status(200).json(report[0]);
};

// Update a report by ID
export const updateReport = (req: Request, res: Response) => {
	const { id } = req.params;
	const { text } = req.body;

	const report = db.query('SELECT * FROM reports WHERE id = @id', {
		id,
	}) as Report[];

	if (report.length === 0) {
		return res.status(404).json({ message: 'Report not found' });
	}

	db.run('UPDATE reports SET text = @text WHERE id = @id', { id, text });

	res.status(200).json({ id, text });
};

// Delete a report by ID
export const deleteReport = (req: Request, res: Response) => {
	const { id } = req.params;

	const report = db.query('SELECT * FROM reports WHERE id = @id', {
		id,
	}) as Report[];

	if (report.length === 0) {
		return res.status(404).json({ message: 'Report not found' });
	}

	db.run('DELETE FROM reports WHERE id = @id', { id });

	res.status(204).send();
};

// Special API Endpoint: Retrieve reports where the same word appears at least three times
export const getReportsWithRepeatedWords = (req: Request, res: Response) => {
	// Use type assertion to cast the query result to Report[]
	const reports = db.query('SELECT * FROM reports') as Report[];

	const reportsWithRepeatedWords = reports.filter((report) => {
		const wordCounts: { [key: string]: number } = {};

		// Split the text into words and count occurrences
		report.text
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, '') // Remove punctuation
			.split(/\s+/) // Split by spaces
			.forEach((word) => {
				wordCounts[word] = (wordCounts[word] || 0) + 1;
			});

		// Check if any word appears at least three times
		return Object.values(wordCounts).some((count) => count >= 3);
	});

	res.status(200).json(reportsWithRepeatedWords);
};
