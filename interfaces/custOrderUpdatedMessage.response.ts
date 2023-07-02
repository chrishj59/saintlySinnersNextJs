import { MessageStatusEnum } from 'utils/Message-status.enum';
interface custOrderResponseType {
	orderId: string;
	rowsUpdated: number;
}

export type CustOrderUpdatedResponseDto = {
	status: MessageStatusEnum;
	orderMessage: custOrderResponseType;
};
