import { API_PORT, MOCk_PORT } from '@/api/config';

import http from '@/api';

import type { Result } from '@/types';

// 获取菜单列表
export const getMenuList = () => {
	return http.post<Menu.MenuOptions[]>(MOCk_PORT + `/hooks/menu/list`);
};

// 登录
export const login = params => {
	return http.post<Result>(API_PORT + '/user/login', params);
};
