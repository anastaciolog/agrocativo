import { v4 as uuidv4 } from 'uuid';


export function generateId(): string {
	return uuidv4()
}

export function confirmationCode(): string {
	return (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString().substring(0, 6)
}

export function txid(): string {
	let res = ""
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < 32; i++) {
		res += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return res;
}