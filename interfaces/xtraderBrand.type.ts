import { imageAWS } from './awsData.type';

export type XtrBrandType = {
	id: number;
	name: string;
	isFavourite: boolean;
	ranking: number;
	imageName?: string;
	image?: imageAWS;
};
