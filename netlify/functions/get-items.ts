import { Handler } from '@netlify/functions';

require('dotenv').config();

const headers = {
	'Access-Control-Allow-Origin': '*',
};

const handler: Handler = async (event, context) => {
	var Airtable = require('airtable');
	Airtable.configure({
		apiKey: process.env.VITE_AIRTABLE_API_KEY,
	});

	var base = Airtable.base('appswuXRTyToGWzD2');
	try {
		const records = await base('Gift Tracker')
			.select({
				view: 'Main view',
			})
			.firstPage();

		let response: any[] = [];
		records.forEach((rec: any) => {
			response.push({
				id: rec._rawJson.id,
				name: rec.get('Item'),
				pic: rec.get('Pic'),
				price: rec.get('Price'),
				notes: rec.get('Notes'),
				recipients: rec.get('Recipients'),
				link: rec.get('Link'),
				purchased: rec.get('Purchased?'),
			});
		});

		return {
			statusCode: 200,
			body: JSON.stringify(response),
			headers,
		};
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: JSON.stringify({ status: 500, error: err }),
			headers,
		};
	}
};

export { handler };
