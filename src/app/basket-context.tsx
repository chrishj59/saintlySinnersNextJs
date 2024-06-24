'use client'; // import { ProductAxiosType } from '@interfaces/product.type';
import { createContext, ReactNode, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DELIVERY_INFO_TYPE } from '@/interfaces/delivery-info.type';
import { DELIVERY_CHARGE_TYPE } from '@/interfaces/delivery-charge.type';
import { ProductAxiosType } from '@/interfaces/product.type';
import { XtraderProductResp } from '@/interfaces/xtraderProduct.type';
import { CardNumberElementProps } from '@stripe/react-stripe-js';

export type basketItemType = {
	id: number;
	ean: string;
	item: XtraderProductResp;
	itemStr?: string;
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
	addItem: (
		item: XtraderProductResp,
		attributes: string,
		quantity: number
	) => void;
	removeItem: (id: number) => void;
	clearAll: () => void;
	getQuantity: () => number;
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
		firstName: '',
		lastName: '',
		phone: '',
		street: '',
		street2: '',
		town: '',
		county: '',
		postCode: '',
		country: 0,
		deliveryCost: 0,
		house_number_input: '',
		house_number: 0,
	},
	checkoutStep: 0,
	addItem: (item: XtraderProductResp) => {},
	addDeliveryInfo: (deliveryInfo: DELIVERY_INFO_TYPE) => {},
	removeItem: (id: number) => {},
	clearAll: () => {},
	getQuantity: () => 0,
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

	const addItem = (
		product: XtraderProductResp,
		prodStr: string,
		quantity: number = 1
	) => {
		const _items = items;
		const basketItem: basketItemType = {
			id: product.id,
			ean: product.selectedEan ? product.selectedEan : '',
			item: product,
			itemStr: prodStr,
			quantity: quantity,
			unitPrice: Number(Number(product.retailPrice).toFixed(2)),
			linePrice: Number((Number(product.retailPrice) * quantity).toFixed(2)),
		};
		let _quantity = quantity;
		const itemIdx = _items.findIndex(
			(i) => product.id === i.id && prodStr === i.itemStr
		);
		if (itemIdx === -1) {
			//not found so add to items array
			basketItem.ean = product.ean ? product.ean : '';
			basketItem.quantity = 1;
			_items.push(basketItem);
		} else {
			//there is an existing item
			const basketItem = _items[itemIdx];

			basketItem.quantity = basketItem.quantity + 1;
			_items[itemIdx] = basketItem;
		}
		// _quantity = _quantity + 1;

		const _linePrice = Number(basketItem.linePrice.toFixed(2));
		const _totalCost = Number((totalCost + _linePrice).toFixed(2));

		setItems(_items);
		setTotalCost(_totalCost);
		setPayable(Number((payable + basketItem.linePrice).toFixed(2)));
		setQuantity(_quantity);
	};

	const removeItem = (id: number) => {
		const _items = items;

		const itemIdx = items.findIndex((e) => e.id === id);
		if (itemIdx === -1) {
			return;
		}
		const item = items[itemIdx];
		if (item.quantity === 1) {
			_items.splice(itemIdx, 1);
		} else {
			item.quantity = item.quantity - 1;
		}
		if (item) {
			setTotalCost(totalCost - item.unitPrice);
			setQuantity(quantity - item.quantity);
			setPayable(payable - item.linePrice);
		}

		setItems(_items);
	};

	const getQuantity = (): number => {
		const _quantity = items.reduce((accum: number, current: basketItemType) => {
			return accum + current.quantity;
		}, 0);

		// if (items.length > 0) {
		// 	return items.length.toString();
		// }
		// return '0';
		return _quantity;
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
		setDeliveryInfo(delInfo);
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
