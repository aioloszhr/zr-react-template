import { PORT1 } from '@/api/config';

import http from '@/api';

// * 获取菜单列表
export const getMenuList = () => {
	return http.post<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
};
