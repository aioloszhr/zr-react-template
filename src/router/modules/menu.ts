import { lazy } from 'react';

import type { AppRouteObject } from '@/router/types';

// 首页模块
const userRouter: AppRouteObject = {
	path: '/menu',
	name: '系统管理',
	Component: lazy(() => import('@/views/menu'))
};

export default userRouter;
