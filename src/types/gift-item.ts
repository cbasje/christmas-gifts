export interface GiftItem {
    [key: string]: string | number | string[] | boolean | undefined
	id: string;
	name: string;
	pic: string;
	price: number;
	notes: string;
	recipient: string[];
	link: string;
	purchased: boolean;
}