import { useEffect } from 'react';
import { useMessageStore } from '@/store/message';
import { antdUtils } from '@/utils/antd';

export enum SocketMessageType {
	PermissionChange = 'PermissionChange',
	PasswordChange = 'PasswordChange',
	TokenExpire = 'TokenExpire'
}

const MessageHandle = () => {
	const { latestMessage } = useMessageStore();

	const messageHandleMap = {
		[SocketMessageType.PermissionChange]: () => {
			antdUtils.modal?.warning({
				title: '权限变更',
				content: '由于你的权限已经变更，需要重新刷新页面。',
				onOk: () => {
					window.location.reload();
				}
			});
		}
	};

	useEffect(() => {
		if (latestMessage?.type && messageHandleMap[latestMessage?.type]) {
			messageHandleMap[latestMessage?.type]();
		}
	}, [latestMessage]);

	return null;
};

export default MessageHandle;
