import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../src/index';
import db from '../src/services/db.service';

const AUTH_TOKEN = 'Password123';

describe('REST API Tests', () => {
	let projectId: string;
	let reportId: string;

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

		// Insert a sample report and store its ID for the tests
		reportId = uuidv4();
		db.run(
			'INSERT INTO reports (id, text, projectid) VALUES (@id, @text, @projectid)',
			{
				id: reportId,
				text: 'Sample Report Text',
				projectid: projectId,
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
	it('POST /reports - Create a report', async () => {
		const res = await request(app)
			.post('/reports') // Endpoint for report creation
			.set('Authorization', AUTH_TOKEN)
			.send({ text: 'Test Report Text', project_id: projectId });

		// Ensure that the response has the expected properties
		expect(res.statusCode).toBe(201);
		expect(res.body).toHaveProperty('id');
		expect(res.body.text).toBe('Test Report Text');
		expect(res.body.project_id).toBe(projectId);
	});

	// Test: Get all reports
	it('GET /reports - Get all reports', async () => {
		const res = await request(app)
			.get('/reports')
			.set('Authorization', AUTH_TOKEN);

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBeTruthy();
	});

	// Test: Get a report by ID
	it('GET /reports/:id - Get a report by ID', async () => {
		const res = await request(app)
			.get(`/reports/${reportId}`)
			.set('Authorization', AUTH_TOKEN);

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('id', reportId);
		expect(res.body.text).toBe('Sample Report Text');
	});

	// Test: Update a report
	it('PUT /reports/:id - Update a report', async () => {
		const res = await request(app)
			.put(`/reports/${reportId}`)
			.set('Authorization', AUTH_TOKEN)
			.send({ text: 'Updated Report Text' });

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('text', 'Updated Report Text');
	});

	// Test: Delete a report
	it('DELETE /reports/:id - Delete a report', async () => {
		const res = await request(app)
			.delete(`/reports/${reportId}`)
			.set('Authorization', AUTH_TOKEN);

		expect(res.statusCode).toBe(204);
	});

	// Test: Get reports with repeated words
	it('GET /reports/repeated-words - Get reports with repeated words', async () => {
		db.run(
			'INSERT INTO reports (id, text, projectid) VALUES (@id, @text, @projectid)',
			{
				id: uuidv4(),
				text: 'Word word word appears multiple times here.', // A report with repeated words
				projectid: projectId,
			},
		);

		db.run(
			'INSERT INTO reports (id, text, projectid) VALUES (@id, @text, @projectid)',
			{
				id: uuidv4(),
				text: 'Unique words only.', // A report with no repeated words
				projectid: projectId,
			},
		);

		db.run(
			'INSERT INTO reports (id, text, projectid) VALUES (@id, @text, @projectid)',
			{
				id: uuidv4(),
				text: 'HELLO hello hElLo hellO HEllo hello hELLo.', // A report with repeated words
				projectid: projectId,
			},
		);

		const res = await request(app)
			.get('/reports/repeated-words')
			.set('Authorization', AUTH_TOKEN);

		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.body)).toBeTruthy();
		expect(res.body.length).toBe(2); // Only one report has repeated words
		expect(res.body[0].text).toBe(
			'Word word word appears multiple times here.',
		);
	});
});
