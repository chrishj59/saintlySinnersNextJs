import { imageAWS } from './awsData.type';

export type catImage = {
	id: string;
	key: string;
};
export type xtraderCategoryType = {
	id?: number;
	name: string;
	parentId?: number;
	imageKey?: string;
	imageType?: string;
};

export type xtraderCategorySelectType = {
	id: number;
	catName: string;
	childCategories?: xtraderCategorySelectType[];
	parentCategory?: xtraderCategorySelectType;
	image: imageAWS;
	imageFormat?: string;
	imageData?: string;
};

export type categoriesFileType = {
	categories_name: string;
	categories_id: string;
	parent_id: string;
	categories_image: string;
};
