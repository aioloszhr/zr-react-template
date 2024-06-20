import { lazy } from 'react';

import type { AppRouteObject } from '@/router/types';

// 首页模块
const userRouter: AppRouteObject = {
	path: '/system',
	name: '系统管理',
	children: [
		{
			path: '/user',
			name: '用户管理',
			Component: lazy(() => import('@/views/user'))
		}
	]
};

export default userRouter;
