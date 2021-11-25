import { Handler } from '@netlify/functions';

require('dotenv').config();

const headers = {
	'Access-Control-Allow-Origin': '*',
};

const handler: Handler = async (event, context) => {
	if (!event.body) {
		return {
			statusCode: 500,
			body: JSON.stringify({ status: 500, message: 'No body specified' }),
			headers,
		};
	}
	const body = JSON.parse(event.body);

	var Airtable = require('airtable');
	Airtable.configure({
		apiKey: process.env.VITE_AIRTABLE_API_KEY,
	});

	var base = Airtable.base('appswuXRTyToGWzD2');
	try {
		const records = await base('Gift Tracker').create([
			{
				fields: {
					Item: body.name,
					Price: body.price,
					Notes: body.notes,
					Link: body.link,
					Pic: body.pic,
					Recipients: body.recipients,
					'Purchased?': false,
					Groups: body.groups,
				},
			},
		]);

		if (records.length == 0) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					status: 400,
					error: 'No records created',
				}),
				headers,
			};
		}

		let response = {
			id: records[0]._rawJson.id,
			name: records[0].get('Item'),
			price: records[0].get('Price'),
			notes: records[0].get('Notes'),
			link: records[0].get('Link'),
			pic: records[0].get('Pic'),
			recipients: records[0].get('Recipients'),
			purchased: records[0].get('Purchased?'),
		};

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
