import { GiftItem } from '@/types/gift-item';
import { User } from '@/types/user';

export const giftsMock: GiftItem[] = [
	{
		id: '1',
		name: 'An item',
		price: '',
		notes: '',
		recipients: ['3'],
		link: '',
		purchased: true,
	},
	{
		id: '2',
		name: 'Another item',
		price: '',
		notes: '',
		recipients: ['1'],
		link: '',
		purchased: false,
	},
	{
		id: '3',
		name: 'Some item',
		price: '',
		notes: '',
		recipients: ['1'],
		link: '',
		purchased: false,
	},
];

export const usersMock: User[] = [
	{
		id: '1',
		name: 'A person',
		password: '',
		items: ['2', '3'],
	},
	{
		id: '2',
		name: 'A person',
		password: 'apassword',
		items: [],
	},
	{
		id: '3',
		name: 'Another person',
		password: '',
		items: ['1'],
	},
];
