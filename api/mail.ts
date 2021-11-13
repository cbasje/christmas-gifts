import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
	);

	const SendGrid = require('@sendgrid/mail');
	SendGrid.setApiKey(process.env.VITE_SENDGRID_API_KEY);
	
	SendGrid.send(req.body).then(
		(data) => {
			console.log(data);
			res.status(data[0].statusCode);
			res.json(data);
		},
		(error) => {
			console.error(error);
			res.status(500);
			res.send(error);
			
			if (error.response) {
				res.status(error.response.statusCode);
				console.error(error.response.body);
			}
		}
	);
};
