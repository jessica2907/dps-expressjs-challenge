import { Report } from './report.model';

export interface Project {
	id: string;
	name: string;
	description: bigint;
	reports: Report[];
}
