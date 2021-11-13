export interface GiftItem {
    [key: string]: string | number | Recipient | boolean | undefined
	id: string;
	name: string;
	pic: string;
	price: number;
	notes: string;
	recipient: Recipient;
	link: string;
	purchased: boolean;
}

interface Recipient {
	id: string;
	name: string;
}