import supabase from '$lib/server/supabase';

export const isFile = (input: FormDataEntryValue | null) => {
	if (input instanceof File && input.name && input.name !== 'undefined') {
		return input;
	} else {
		return false;
	}
};

export const uploadFile = async (id: string, file: File) => {
	// Write the file to the static folder
	// writeFileSync(`static/${file.name}`, Buffer.from(await file.arrayBuffer()));

	const extension = file.name.split('.').at(-1);
	const contentType = 'image/' + extension?.toLowerCase();

	// const filename = `${id}.${}`;
	const { data, error } = await supabase.storage.from('files').upload(id, file, {
		upsert: true,
		contentType
	});
	if (error) {
		throw new Error(error.message, { cause: error });
	} else {
		return data.path;
	}
};

export const getSupabaseURL = (image: string) => {
	return supabase.storage.from('files').getPublicUrl(image).data.publicUrl;
};
