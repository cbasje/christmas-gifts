import supabase from '$lib/server/supabase';

export const isFile = (input: FormDataEntryValue | null) => {
	return input instanceof File && input.name && input.name !== 'undefined';
};

export const uploadFile = async (id: string, file: File) => {
	// Write the file to the static folder
	// writeFileSync(`static/${file.name}`, Buffer.from(await file.arrayBuffer()));

	const extension = file.name.split('.').at(-1);
	const contentType = 'image/' + extension?.toLowerCase();
	console.log('🎄 --------------------------------------🎄');
	console.log('🎄 ~ uploading:', file.name, contentType);
	console.log('🎄 --------------------------------------🎄');

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
