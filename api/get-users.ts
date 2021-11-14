import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
	);

	var Airtable = require('airtable');
	Airtable.configure({
		apiKey: process.env.VITE_AIRTABLE_API_KEY,
	});

	var base = Airtable.base('appswuXRTyToGWzD2');
	base('Users')
		.select({
			view: 'Main view',
		})
		.firstPage((err: any, records: any) => {
			if (err) {
				console.error(err);
				res.status(500);
				res.send(err);

				return;
			}
			let response: any[] = [];
			records.forEach((rec: any) => {
				response.push({
					id: rec._rawJson.id,
					name: rec.get('Name'),
					password: rec.get('Password'),
					color: rec.get('Color'),
					colorDark: rec.get('ColorDark'),
					items: rec.get('Gift Ideas')
				});
			});

			res.status(200);
			res.json(response);
		});
};
