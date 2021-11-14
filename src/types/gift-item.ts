import { User } from "./user";

export interface GiftItem {
	[key: string]: any;
	id: string;
	name: string;
	pic?: Pic[];
	price?: number;
	notes?: string;
	recipient: User[];
	link?: string;
	purchased?: boolean;
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
