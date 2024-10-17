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
	const formatter = new Intl.NumberFormat('en-GB', {
		style: 'decimal',
		minimumSignificantDigits: 2,
		maximumSignificantDigits: 2,
	});

	return formatter.format(input);
	// return input.toFixed(2);
};

export const dateGB = (input: Date): string => {
	const dob = new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(input);
	return dob;
};

export const orderStatus = (status: number) => {
	let statusText = '';
	switch (status) {
		case 0:
			statusText = 'Order saved';
			break;
		case 1:
			statusText = 'Paid';
			break;
		case 2:
			statusText = 'Emailed to you';
			break;
		case 3:
			statusText = 'Ordered';
			break;
		case 4:
			statusText = 'Paid';
			break;
		case 5:
			statusText = 'Delivered';
			break;
	}

	return statusText;
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
