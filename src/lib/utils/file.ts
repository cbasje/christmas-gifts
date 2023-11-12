import supabase from '$lib/server/supabase';
import { fail } from '@sveltejs/kit';
import { writeFileSync } from 'node:fs';

export const uploadFile = async (id: string, file: FormDataEntryValue | null) => {
	if (!(file instanceof File) || !file.name || file.name === 'undefined') {
		return fail(400, {
			error: true,
			message: 'No file provided'
		});
	}

	// Write the file to the static folder
	// writeFileSync(`static/${file.name}`, Buffer.from(await file.arrayBuffer()));

	const filename = `${id}.${file.name.split('.').at(-1)}`;
	const { data, error } = await supabase.storage.from('files').upload(filename, file, {
		upsert: true
	});
	if (error) {
		throw new Error(error.message, { cause: error });
	} else {
		return data.path;
	}
};
