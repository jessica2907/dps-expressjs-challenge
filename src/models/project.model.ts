import { Report } from './report.model';

export interface Project {
	id: string;
	name: string;
	description: string /** DPS Team has approved my suggestion to change the type to string */;
	reports: Report[];
}
