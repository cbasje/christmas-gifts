export interface Project {
    [key: string]: string | Date | Category | undefined
	id: string;
	title: string;
	image: string;
	date: Date;
	keywords: string;
	categories: Category;
	url?: string;
}

export interface ProjectDetail extends Project {
	text: string
}

export interface Category {
	id: number;
	title: string;
}