import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
	);

	if (!req.body) {
		res.status(500);
		res.end();
		return;
	}

	var Airtable = require('airtable');
	Airtable.configure({
		apiKey: process.env.VITE_AIRTABLE_API_KEY,
	});

	var base = Airtable.base('appswuXRTyToGWzD2');
	base('Gift Ideas')
		.select({
			view: 'Main View',
		})
		.firstPage(function (err, records) {
			if (err) {
				console.error(err);
				res.status(500);
				res.send(err);

				return;
			}
			let response = [];
			records.forEach((rec) => {
				response.push(rec._rawJson);
				console.log('Retrieved', rec.get('Item'));
			});

			res.status(200);
			res.json(response);
		});
};
