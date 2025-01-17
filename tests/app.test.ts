import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../src/index';
import db from '../src/services/db.service';

const AUTH_TOKEN = 'Password123';

describe('REST API Tests', () => {
	let projectId: string;
	//let reportId: string;

	// Runs before each test
	beforeEach(() => {
		// Clear the database to ensure isolation between tests
		db.run('DELETE FROM projects');
		db.run('DELETE FROM reports');

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
		const res = await request(app)
			.post('/projects')
			.set('Authorization', AUTH_TOKEN)
			.send({
				name: 'Test Project',
				description: 'A project for testing purposes',
			});
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('id');
	});

	// Test: Get all projects
	it('GET /projects - Get all projects', async () => {
		const res = await request(app)
			.get('/projects')
			.set('Authorization', AUTH_TOKEN);
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBeTruthy();
	});

	// Test: Get a single project by ID
	it('GET /projects/:id - Get a project by ID', async () => {
		const res = await request(app)
			.get(`/projects/${projectId}`)
			.set('Authorization', AUTH_TOKEN);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('id', projectId);
	});

	// Test: Update a project
	it('PUT /projects/:id - Update a project', async () => {
		const res = await request(app)
			.put(`/projects/${projectId}`)
			.set('Authorization', AUTH_TOKEN)
			.send({ name: 'Updated Project Name' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('name', 'Updated Project Name');
	});

	// Test: Delete a project
	it('DELETE /projects/:id - Delete a project', async () => {
		const res = await request(app)
			.delete(`/projects/${projectId}`)
			.set('Authorization', AUTH_TOKEN);
		expect(res.statusCode).toBe(204);
	});

	// Test: Create a report
	it('POST /projects/:project_id/reports - Create a report', async () => {
		const res = await request(app)
			.post(`/projects/${projectId}/reports`)
			.set('Authorization', AUTH_TOKEN)
			.send({ text: 'Test Report Text' });

		//expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('id');
		expect(res.body.text).toBe('Test Report Text');
		expect(res.body.project_id).toBe(projectId);
	});
});
