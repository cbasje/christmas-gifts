import { GiftItem } from '@/types/gift-item';
import { Group, User } from '@/types/user';

export const giftsMock: GiftItem[] = [
	{
		id: '1',
		name: 'A Benjamins item',
		price: '',
		notes: '',
		recipients: ['3'],
		link: '',
		purchased: true,
		groups: ['1']
	},
	{
		id: '2',
		name: 'Another Benjamins item',
		price: '',
		notes: '',
		recipients: ['1'],
		link: '',
		purchased: false,
		groups: ['1']
	},
	{
		id: '3',
		name: 'Some Benjamins item',
		price: '',
		notes: '',
		recipients: ['1'],
		link: '',
		purchased: false,
		groups: ['1']
	},
	{
		id: '4',
		name: 'A Haugen item',
		price: '',
		notes: '',
		recipients: ['3'],
		link: '',
		purchased: false,
		groups: ['2']
	},
	{
		id: '5',
		name: 'Another Haugen item',
		price: '',
		notes: '',
		recipients: ['1'],
		link: '',
		purchased: false,
		groups: ['2']
	},
	{
		id: '6',
		name: 'Some Haugen item',
		price: '',
		notes: '',
		recipients: ['2'],
		link: '',
		purchased: true,
		groups: ['2']
	},
];

export const usersMock: User[] = [
	{
		id: '1',
		name: 'A person',
		password: '',
		items: ['2', '3'],
		groups: ['1'],
	},
	{
		id: '2',
		name: 'A person',
		password: 'apassword',
		items: [],
		groups: ['1'],
	},
	{
		id: '3',
		name: 'Another person',
		password: '',
		items: ['1'],
		groups: ['1'],
	},
];

export const groupsMock: Group[] = [
	{
		id: '1',
		name: 'Benjamins',
		users: ['1', '3'],
	},
	{
		id: '2',
		name: 'Haugen',
		users: ['2'],
	},
];
