import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../src/index';
import db from '../src/services/db.service';

describe('REST API Tests', () => {
	let projectId: string;

	// Runs before each test
	beforeEach(() => {
		// Clear the database to ensure isolation between tests
		db.run('DELETE FROM projects');

		// Insert a sample project and store its ID for the tests
		projectId = uuidv4();
		db.run(
			'INSERT INTO projects (id, name, description) VALUES (@id, @name, @description)',
			{
				id: projectId,
				name: 'Sample Project',
				description: 'A project preloaded for testing',
			},
		);
	});

	// Test: Create a project
	it('POST /projects - Create a project', async () => {
		const res = await request(app).post('/projects').send({
			name: 'Test Project',
			description: 'A project for testing purposes',
		});
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('id');
	});

	// Test: Get all projects
	it('GET /projects - Get all projects', async () => {
		const res = await request(app).get('/projects');
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBeTruthy();
	});

	// Test: Get a single project by ID
	it('GET /projects/:id - Get a project by ID', async () => {
		const res = await request(app).get(`/projects/${projectId}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('id', projectId);
	});

	// Test: Update a project
	it('PUT /projects/:id - Update a project', async () => {
		const res = await request(app)
			.put(`/projects/${projectId}`)
			.send({ name: 'Updated Project Name' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('name', 'Updated Project Name');
	});

	// Test: Delete a project
	it('DELETE /projects/:id - Delete a project', async () => {
		const res = await request(app).delete(`/projects/${projectId}`);
		expect(res.statusCode).toBe(204);
	});
});
