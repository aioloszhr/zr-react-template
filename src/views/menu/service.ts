import request from '@/request';

import type { Menu } from './interface';

const menuService = {
	getMenusByPage: async (
		{ current, pageSize }: { current: number; pageSize: number },
		formData?: any
	) => {
		return request.get<PageData<Menu>>('/api/menu/page', {
			params: {
				page: current - 1,
				size: pageSize,
				...formData
			}
		});
	},
	/** 创建菜单 */
	addMenu: (menu: Menu) => {
		return request.post<any>('/api/menu', menu);
	},
	/** 更新菜单 */
	updateMenu: (menu: Menu) => {
		return request.put(`/api/menu`, menu);
	},
	/** 删除菜单 */
	removeMenu: (id: string) => {
		return request.delete(`/api/menu/${id}`);
	},
	getChildren: (parentId: string) => {
		return request.get<Menu[]>('/api/menu/children', { params: { parentId } });
	}
};

export default menuService;
