'use server';
import { revalidateTag } from 'next/cache';

export async function productOverviewRevalidate() {
	revalidateTag('productOverview');
}

export async function bandListRevalidate() {
	revalidateTag('brandList');
}
