import { useEffect } from 'react';
import { RouteObject, RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from 'antd';
import { antdUtils } from '@/utils/antd';
import Login from '@/views/login';
import BasicLayout from '@/layout';
import RouterErrorElement from './router-error-element';

export const router = createBrowserRouter([
	{
		path: '/user/login',
		Component: Login
	},
	{
		path: '/',
		element: <Navigate to='/dashboard' />
	},
	{
		path: '*',
		Component: BasicLayout,
		children: [],
		errorElement: <RouterErrorElement />
	}
]);

export const replaceRoutes = (parentPath: string, routes: RouteObject[]) => {
	if (!parentPath) {
		router.routes.push(...(routes as any));
		return;
	}

	const curNode = findNodeByPath(router.routes, parentPath);

	if (curNode) {
		curNode.children = routes;
	}
};

function findNodeByPath(routes: RouteObject[], path: string) {
	for (let i = 0; i < routes.length; i += 1) {
		const element = routes[i];

		if (element.path === path) return element;

		findNodeByPath(element.children || [], path);
	}
}

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
