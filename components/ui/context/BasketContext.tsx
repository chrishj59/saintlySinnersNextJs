import { createContext, ReactNode, useContext, useState } from 'react';

type basketItemType = {
	id: number;
	quantity: number;
	price: number;
};
type basketContextType = {
	items: basketItemType[] | null;
	totalCost: number;
	devlivery: number;
	payable: number;
	quantity: number;
	addItem: (item: basketItemType) => void;
	removeItem: (item: basketItemType) => void;
	clearAll: () => void;
};

const basketContextDefaultValues: basketContextType = {
	items: [],
	totalCost: 0,
	devlivery: 0,
	payable: 0,
	quantity: 1,
	addItem: (item: basketItemType) => {},
	removeItem: (item: basketItemType) => {},
	clearAll: () => {},
};

const BasketContext = createContext<basketContextType>(
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
	const addItem = (item: basketItemType) => {
		const _items = items;
		_items.push(item);
		setItems(_items);
		setTotalCost(totalCost + item.price);
		setPayable(payable + item.price);
		setQuantity(quantity);
	};

	const removeItem = (item: basketItemType) => {
		const _items = items.filter((i) => i.id !== item.id);
		setTotalCost(totalCost - item.price);
		setQuantity(quantity - item.quantity);
		setPayable(payable - item.price);

		setItems(_items);
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
	};

	return (
		<>
			<BasketContext.Provider value={value}>{children}</BasketContext.Provider>
		</>
	);
}
