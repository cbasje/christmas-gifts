import { GiftItem } from '@/types/gift-item';
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
	base('Gift Tracker').update(
		[
			{
				id: req.body.id,
				fields: {
					'Purchased?': req.body.purchased,
				},
			},
		],
		function (err: any, records: any[]) {
			if (err) {
				console.error(err);
				res.status(500);
				res.send(err);

				return;
			}

			if (records.length == 0) {
				res.status(400);
				res.end();
			}

			let response = {
				id: records[0]._rawJson.id,
				purchased: records[0].get('Purchased?'),
			};

			res.status(200);
			res.json(response);
		}
	);
};
