import { lazy } from 'react';

import type { AppRouteObject } from '@/router/types';

// 首页模块
const homeRouter: AppRouteObject = {
	path: '/home',
	name: 'Home',
	Component: lazy(() => import('@/views/home'))
};

export default homeRouter;
