import { InterfaceType } from 'typescript';

export function isIterable(input: any) {
	if (input === null || input === undefined) {
		return false;
	}

	return typeof input[Symbol.iterator] === 'function';
}

export const isInterfaceTypeIterable = (
	i: InterfaceType | Iterable<InterfaceType>
): i is Iterable<InterfaceType> => {
	return Symbol.iterator in (i as Iterable<InterfaceType>);
};

export const formatCurrency = (value: number | string | undefined) => {
	if (value === undefined || value === null) {
		value = 0;
	}

	return value.toLocaleString('en-GB', {
		style: 'currency',
		currency: 'GBP',
	});
};

export const financialNumber = (input: number): string => {
	return input.toFixed(2);
};

export type Sitemap = Array<{
	url: string;
	lastModified?: string | Date;
	changeFrequency?:
		| 'always'
		| 'hourly'
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'yearly'
		| 'never';
	priority?: number;
}>;
