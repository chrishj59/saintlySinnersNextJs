import { ProductAxiosType } from 'interfaces/product.type';
import { createContext, ReactNode, useContext, useState } from 'react';

import { DELIVERY_INFO_TYPE } from 'interfaces/delivery-info.type';
import { DELIVERY_CHARGE_TYPE } from 'interfaces/delivery-charge.type';

export type basketItemType = {
	id: string;
	item: ProductAxiosType;
	quantity: number;
	unitPrice: number;
	linePrice: number;
};
export type basketContextType = {
	items: basketItemType[];
	deliveryInfo: DELIVERY_INFO_TYPE | undefined;
	totalCost: number;
	delivery: number;
	payable: number;
	quantity: number;
	checkoutStep: number;
	addItem: (item: ProductAxiosType, quantity: number) => void;
	removeItem: (itemId: string) => void;
	clearAll: () => void;
	getQuantity: () => void;
	updateCheckoutStep: (newStep: number) => void;
	addDeliveryInfo: (deliveryInfo: DELIVERY_INFO_TYPE) => void;
	removeDeliveryInfo: (deliveryInfo: DELIVERY_INFO_TYPE) => void;
};

const basketContextDefaultValues: basketContextType = {
	items: [],
	totalCost: 0,
	delivery: 0,
	payable: 0,
	quantity: 0,
	deliveryInfo: {
		email: '',
		name: '',
		phone: '',
		street: '',
		street2: '',
		town: '',
		county: '',
		postCode: '',
		country: '',
		deliveryCharge: 0,
	},
	checkoutStep: 0,
	addItem: (item: ProductAxiosType) => {},
	addDeliveryInfo: (deliveryInfo: DELIVERY_INFO_TYPE) => {},
	removeItem: (itemId: string) => {},
	clearAll: () => {},
	getQuantity: () => {},
	updateCheckoutStep: (newStep) => {},
	removeDeliveryInfo: (deliveryInfo: DELIVERY_INFO_TYPE) => {},
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
	const [delivery, setDelivery] = useState<number>(0);
	const [payable, setPayable] = useState<number>(0);
	const [quantity, setQuantity] = useState<number>(2);
	const [deliveryInfo, setDeliveryInfo] = useState<DELIVERY_INFO_TYPE>();
	const [checkoutStep, setCheckoutStep] = useState<number>(0);

	const addItem = (product: ProductAxiosType, quantity: number = 1) => {
		const _items = items;

		const basketItem: basketItemType = {
			id: product.artnr,
			item: product,
			quantity,
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
		setDelivery(0);
		setPayable(0);
		setDeliveryInfo(undefined);
	};

	const updateCheckoutStep = (newStep: number) => {
		setCheckoutStep(newStep);
	};

	const addDeliveryInfo = (delInfo: DELIVERY_INFO_TYPE) => {
		console.log(
			`addDeliveryInfo called with  ${JSON.stringify(delInfo, null, 2)}`
		);
		setDeliveryInfo(delInfo);
		console.log(
			`deliveryInfo after set ${JSON.stringify(deliveryInfo, null, 2)}`
		);
	};

	const removeDeliveryInfo = () => {
		setDeliveryInfo(undefined);
	};

	const value = {
		items,
		totalCost,
		delivery,
		payable,
		deliveryInfo,
		quantity,
		addItem,
		removeItem,
		clearAll,
		getQuantity,
		checkoutStep,
		updateCheckoutStep,
		addDeliveryInfo,
		removeDeliveryInfo,
	};

	return (
		<>
			<BasketContext.Provider value={value}>{children}</BasketContext.Provider>
		</>
	);
}
