export type CATEGORY_TYPE = {
	id: number;
	title: string;
	onMenu: boolean;
	menulevel: number;
	childCategories?: CATEGORY_TYPE[];
	parentCategory?: CATEGORY_TYPE;
};
