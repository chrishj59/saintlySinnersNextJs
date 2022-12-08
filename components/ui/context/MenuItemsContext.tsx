import { createContext, ReactNode, useContext, useState } from 'react';

import { MenuItem } from '../../../interfaces/menuItem.interface';

type menuItemRec = Record<keyof MenuItem, string | number>;
const menuItemContextDefaultValues: MenuItem = {
	label: '',
};

const MenuItenContext = createContext<MenuItem>(menuItemContextDefaultValues);

export function useAuth() {
	return useContext(MenuItenContext);
}

type Props = {
	children: ReactNode;
};
