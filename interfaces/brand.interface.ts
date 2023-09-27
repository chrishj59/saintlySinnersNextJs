export type Brand = {
	id: number;
	title: string;
	catid: number;
	categoryType: string;
	catDescription: string;
	catLevel: number;
	awsKey?: string;
	onHomePage: boolean;
	awsImage?: string;
	awsImageFormat?: string;
};
