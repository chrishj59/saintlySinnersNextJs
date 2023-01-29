import { MessageStatusEnum } from 'utils/Message-status.enum';

export type RESPONSE_MESSAGE_TYPE = {
	status: MessageStatusEnum;

	message: string;
};
