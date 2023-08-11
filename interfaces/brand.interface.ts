export type Brand = {
	id: number;
	title: string;
	catid: number;
	categoryType: string;
	catDescription: string;
	catLevel: number;
	awsKey?: string;
	onHomePage?: Boolean;
	awsImage?: string;
	awsImageFormat?: string;
};
