import 'server-only';
import { Brand } from '@/interfaces/brand.interface';

export async function allBrands() {
	const url = `${process.env.EDC_API_BASEURL}/brand`;
	const res = await fetch(url);
	const brands = (await res.json()) as Brand[];

	return brands;
}
