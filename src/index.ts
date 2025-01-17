import express, { Express } from 'express';
import dotenv from 'dotenv';
import projectRoutes from './routes/projects.routes';
import reportRoutes from './routes/reports.routes';
import { authenticate } from './middleware/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(authenticate);
app.use('/projects', projectRoutes);
app.use('/reports', reportRoutes);

app.get('/', (req, res) => {
	res.send(`
        <html>
    <head>
        <title>DPS Technical Challenge</title>
        <style>
            body {
                background-color: black;
                color: white;
                font-family: "Courier New", Courier, monospace; /* Typical JSON font style */
            }
            a {
                color: #00ff00; /* Green links for visibility */
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h1>Welcome to ExpressJs Backend Challenge</h1>
        <p>Here are some useful links:</p>
        <ul>
            <li><a href="/projects?auth=Password123">View Projects</a></li>
            <li><a href="/reports?auth=Password123">View Reports</a></li>
            <li><a href="/reports/repeated-words?auth=Password123">View Reports with Repeated Words (at least 3 times)</a></li>
        </ul>
    </body>
</html>

    `);
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app; // Export for testing
