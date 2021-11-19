interface Item {
	name: string;
	price?: string;
	notes?: string;
	recipients: string[];
	link?: string;
	purchased?: boolean;
}

export interface NewGiftItem extends Item {
	pic: string;
}

export interface GiftItem extends Item {
	[key: string]: any;
	id: string;
	pic?: Pic[];
}

interface Pic {
	id: string;
	filename: string;
	height: number;
	width: number;
	size: number;
	type: string;
	url: string;
	thumbnails: Thumbnails;
}

interface Thumbnails {
	small: SingleThumbnail;
	large: SingleThumbnail;
	full: SingleThumbnail;
}

interface SingleThumbnail {
	url: string;
	height: number;
	width: number;
}
