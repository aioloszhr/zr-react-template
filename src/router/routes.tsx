import { lazy } from 'react';
import Layout from '@/layout';
import { appExpandRoutes } from './appRouteModules';

import type { AppRouteObject } from './types';

const routes: AppRouteObject[] = [
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

export default routes;
