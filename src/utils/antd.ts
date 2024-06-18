import { MessageInstance } from 'antd/es/message/interface';
import { ModalStaticFunctions } from 'antd/es/modal/confirm';
import { NotificationInstance } from 'antd/es/notification/interface';

type ModalInstance = Omit<ModalStaticFunctions, 'warn'>;

/**
 *  封装message、modal、notification组件
 *  @des 在hooks外部也可以使用
 */
class AntdUtils {
	message: MessageInstance | null = null;
	notification: NotificationInstance | null = null;
	modal: ModalInstance | null = null;

	setMessageInstance(message: MessageInstance) {
		this.message = message;
	}

	setNotificationInstance(notification: NotificationInstance) {
		this.notification = notification;
	}

	setModalInstance(modal: ModalInstance) {
		this.modal = modal;
	}
}

export const antdUtils = new AntdUtils();
