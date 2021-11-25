export interface User {
	[key: string]: any;
	id: string;
	name: string;
	password: string;
	items: string[];
	groups: string[];
}

export interface Group {
	[key: string]: any;
	id: string;
	name: string;
	users: string[];
}