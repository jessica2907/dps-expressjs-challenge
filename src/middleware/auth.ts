import { Request, Response, NextFunction } from 'express';

// Hardcoded token
const AUTH_TOKEN = 'Password123';

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization;

	if (token === AUTH_TOKEN) {
		next(); // Token is valid, proceed to the next middleware or route handler
	} else {
		res.status(401).json({ message: 'Unauthorized: Invalid token' });
	}
};
