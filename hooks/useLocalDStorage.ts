import { useEffect, useState } from 'react';

const getStorageValue = (key: string, defaultValue: string) => {
	// get stored value
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(key);
		if (saved) {
			const value = JSON.parse(saved);
			return value;
		}
		return defaultValue;
	}
};

export const useLocalStorage = (key: string, defaultValue: string) => {
	const [value, setVlaue] = useState<string>(() => {
		return getStorageValue(key, defaultValue);
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value]),
		[key, value];

	return [value, setVlaue];
};
