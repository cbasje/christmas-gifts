import { ContactForm } from '@/types/contact-form';
import axios from 'axios';

export default {
	sendEmail(form: ContactForm) {
		const baseUrl = '/api';
		const url = baseUrl + '/mail';

		const data = {
			to: 'sebastiaan@benjami.in',
			from: 'sebastiaan@benjami.in',
			replyTo: form.email,
			subject: `Message from ${form.firstName} ${form.lastName}`,
			text: `A message has been posted from ${form.firstName} ${form.lastName} at ${form.email}:`,
			html: `<p>A message has been posted from ${form.firstName} ${form.lastName} at ${form.email}:</p><blockquote>${form.message}</blockquote>`,
		};
		return axios.post(url, data);
	},
	addToAirtable(form: ContactForm) {
		const baseUrl = '/api';
		const url = baseUrl + '/airtable';

		return axios.post(url, form);
	},
};
