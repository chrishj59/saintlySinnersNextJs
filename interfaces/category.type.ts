export type CATEGORY_TYPE = {
	id: number;
	catName: string;
	title: string;
	onMenu: boolean;
	menulevel: number;
	childCategories?: CATEGORY_TYPE[];
	parentCategory?: CATEGORY_TYPE;
};
