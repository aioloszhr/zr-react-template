import { lazy } from 'react';
import Layout from '@/layout';
import { appExpandRoutes } from './appRouteModules';

export default [
	{
		path: '/',
		name: 'Login',
		Component: lazy(() => import('@/views/login'))
	},
	{
		path: '/',
		name: 'Layout',
		element: <Layout />,
		children: appExpandRoutes()
	}
];
