import request from 'supertest';
import app from '../src/index';

describe('REST API Tests', () => {
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
});
