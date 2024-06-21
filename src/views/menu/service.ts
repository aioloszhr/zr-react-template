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
	addMenu: (menu: Menu) => {
		return request.post<any>('/api/menu', menu);
	}
};

export default menuService;
