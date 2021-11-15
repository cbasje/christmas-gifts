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
	base('Gift Tracker').destroy(
		[req.body.id],
		function (err: any, deletedRecords: any[]) {
            if (err) {
				console.error(err);
				res.status(500);
				res.send(err);

				return;
			}

			console.log('Deleted', deletedRecords.length, 'records');

			if (deletedRecords.length == 0) {
				res.status(400);
				res.end();
			}

			let response = {
				id: deletedRecords[0]._rawJson.id,
			};

			res.status(200);
			res.json(response);
		}
	);
};
