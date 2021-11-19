import { GiftItem, NewGiftItem } from '@/types/gift-item';
import { User } from '@/types/user';
import { giftsMock, usersMock } from '@/util/mock';
import axios from 'axios';


const { DEV, VITE_API_BASE_URL } = import.meta.env;

export default {
	// GIFT ITEMS
	async loadGiftItems() {
		if (this.useMock()) return { data: giftsMock };

		const url = VITE_API_BASE_URL + '/get-items';
		return await axios.get<GiftItem[]>(url);
	},

	async togglePurchased(id: string, purchased: boolean) {
		if (this.useMock()) return { data: { id, purchased } };

		const url = VITE_API_BASE_URL + '/set-purchased';
		const body = {
			id,
			purchased,
		};

		return await axios.post<{
			id: string;
			purchased: string;
		}>(url, JSON.stringify(body));
	},

	async addItem(item: NewGiftItem) {
		if (this.useMock()) return { data: item };

		const url = VITE_API_BASE_URL + '/add-item';
		return await axios.post<GiftItem>(url, JSON.stringify(item));
	},

	async removeItem(id: string) {
		if (this.useMock()) return { data: { id } };

		const url = VITE_API_BASE_URL + '/remove-item';
		const body = { id };

		return await axios.post<{ id: string }>(url, JSON.stringify(body));
	},

	// USERS
	async loadUsers() {
		if (this.useMock()) return { data: usersMock };

		const url = VITE_API_BASE_URL + '/get-users';
		return await axios.get<User[]>(url);
	},

	useMock() {
		return DEV;
	},
};
