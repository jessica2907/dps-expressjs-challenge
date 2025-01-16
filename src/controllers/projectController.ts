import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service';

export const createProject = (req: Request, res: Response) => {
	const { name, description } = req.body;
	const id = uuidv4();
	db.run(
		'INSERT INTO projects (id, name, description) VALUES (@id, @name, @description)',
		{ id, name, description },
	);

	res.status(201).json({ id, name, description });
};

export const getAllProjects = (req: Request, res: Response) => {
	const projects = db.query('SELECT * FROM projects');
	res.status(200).json(projects);
};

//export const getProjectById = null;
//export const updateProject = null;
//export const deleteProject = null;
