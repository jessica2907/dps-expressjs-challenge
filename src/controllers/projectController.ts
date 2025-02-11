import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service';
import { Project } from '../models/project.model';

// Create a project
export const createProject = (req: Request, res: Response) => {
	const { name, description } = req.body;
	const id = uuidv4();
	db.run(
		'INSERT INTO projects (id, name, description) VALUES (@id, @name, @description)',
		{ id, name, description },
	);

	res.status(201).json({ id, name, description });
};

// Get all projects
export const getAllProjects = (req: Request, res: Response) => {
	const projects = db.query('SELECT * FROM projects') as Project[];
	res.status(200).json(projects);
};

// Get a project by ID
export const getProjectById = (req: Request, res: Response) => {
	const project = db.query('SELECT * FROM projects WHERE id = @id', {
		id: req.params.id,
	}) as Project[];

	if (project.length === 0) {
		return res.status(404).json({ message: 'Project not found' });
	}

	res.status(200).json(project[0]);
};

// Update a project by ID
export const updateProject = (req: Request, res: Response) => {
	const { name, description } = req.body;

	const result = db.run(
		'UPDATE projects SET name = @name, description = @description WHERE id = @id',
		{ id: req.params.id, name, description },
	);

	if (result.changes === 0) {
		return res.status(404).json({ message: 'Project not found' });
	}

	res.status(200).json({ id: req.params.id, name, description });
};

// Delete a project by ID
export const deleteProject = (req: Request, res: Response) => {
	const result = db.run('DELETE FROM projects WHERE id = @id', {
		id: req.params.id,
	});

	if (result.changes === 0) {
		return res.status(404).json({ message: 'Project not found' });
	}

	res.status(204).send();
};
