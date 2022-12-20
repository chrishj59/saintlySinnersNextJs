import { ProductAxiosType } from 'interfaces/product.type';
import { createContext, ReactNode, useContext, useState } from 'react';

export type basketItemType = {
	id: string;
	item: ProductAxiosType;
	quantity: number;
	unitPrice: number;
	linePrice: number;
};
export type basketContextType = {
	items: basketItemType[];
	totalCost: number;
	devlivery: number;
	payable: number;
	quantity: number;
	addItem: (item: ProductAxiosType) => void;
	removeItem: (itemId: string) => void;
	clearAll: () => void;
	getQuantity: () => void;
};

const basketContextDefaultValues: basketContextType = {
	items: [],
	totalCost: 0,
	devlivery: 0,
	payable: 0,
	quantity: 0,
	addItem: (item: ProductAxiosType) => {},
	removeItem: (itemId: string) => {},
	clearAll: () => {},
	getQuantity: () => {},
};

export const BasketContext = createContext<basketContextType>(
	basketContextDefaultValues
);

export function useBasket() {
	return useContext(BasketContext);
}

type Props = {
	children: ReactNode;
};

export function BasketProvider({ children }: Props) {
	const [items, setItems] = useState<basketItemType[]>([]);
	const [totalCost, setTotalCost] = useState<number>(0);
	const [devlivery, setDevlivery] = useState<number>(0);
	const [payable, setPayable] = useState<number>(0);
	const [quantity, setQuantity] = useState<number>(2);
	const addItem = (product: ProductAxiosType) => {
		const _items = items;

		const basketItem: basketItemType = {
			id: product.artnr,
			item: product,
			quantity: 1,
			unitPrice: Number(product.b2c),
			linePrice: Number(product.b2c) * quantity,
		};
		_items.push(basketItem);
		setItems(_items);
		setTotalCost(totalCost + basketItem.linePrice);
		setPayable(payable + basketItem.linePrice);
		setQuantity(items.length);
	};

	const removeItem = (itemId: string) => {
		const _items = items.filter((i) => i.id !== itemId);
		const item = items.find((e) => e.id === itemId);
		if (item) {
			setTotalCost(totalCost - item?.linePrice);
			setQuantity(quantity - item.quantity);
			setPayable(payable - item.linePrice);
		}
		setItems(_items);
	};

	const getQuantity = () => {
		if (items.length > 0) {
			return items.length;
		}
		return 0;
	};

	const clearAll = () => {
		const _items: basketItemType[] = [];
		setItems(_items);
		setTotalCost(0);
		setDevlivery(0);
		setPayable(0);
	};

	const value = {
		items,
		totalCost,
		devlivery,
		payable,
		quantity,
		addItem,
		removeItem,
		clearAll,
		getQuantity,
	};

	return (
		<>
			<BasketContext.Provider value={value}>{children}</BasketContext.Provider>
		</>
	);
}
