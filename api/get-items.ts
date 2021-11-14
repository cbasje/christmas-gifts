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
	base('Gift Ideas')
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
					name: rec.get('Item'),
					pic: rec.get('Pic'),
					price: rec.get('Price'),
					notes: rec.get('Notes'),
					recipient: rec.get('Recipient'),
					link: rec.get('Link'),
					purchased: rec.get('Purchased?'),
				});
			});

			res.status(200);
			res.json(response);
		});
};
