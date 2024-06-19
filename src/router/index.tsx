import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { App } from 'antd';
import { router } from './routes';
import { antdUtils } from '@/utils/antd';

const Router = () => {
	const { notification, message, modal } = App.useApp();

	useEffect(() => {
		antdUtils.setMessageInstance(message);
		antdUtils.setNotificationInstance(notification);
		antdUtils.setModalInstance(modal);
	}, [notification, message, modal]);

	return <RouterProvider router={router} />;
};

export default Router;
