import supabase from '$lib/server/supabase';

export const isFile = (input: FormDataEntryValue | null) => {
	return input instanceof File && input.name && input.name !== 'undefined';
};

export const uploadFile = async (id: string, file: File) => {
	// Write the file to the static folder
	// writeFileSync(`static/${file.name}`, Buffer.from(await file.arrayBuffer()));

	// const filename = `${id}.${file.name.split('.').at(-1)}`;
	const { data, error } = await supabase.storage.from('files').upload(id, file, {
		upsert: true
	});
	if (error) {
		throw new Error(error.message, { cause: error });
	} else {
		return data.path;
	}
};
