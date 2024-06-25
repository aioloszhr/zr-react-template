import request from '@/request';

import type { Menu } from '../menu/interface';

export interface Role {
	id?: string;
	name: string;
	code: string;
	createDate: string;
	updateDate: string;
}

const roleService = {
	getRoleListByPage: async (
		{ current, pageSize }: { current: number; pageSize: number },
		formData: any
	) => {
		return await request.get<PageData<Role>>('/api/role/page', {
			params: {
				page: current - 1,
				size: pageSize,
				...formData
			}
		});
	},
	getAllMenus: () => {
		return request.get<Menu[]>('/api/menu/list');
	},
	/** 新增角色 */
	addRole: (role: Role) => {
		return request.post('/api/role', role);
	},
	/** 更新角色 */
	updateRole: (role: Role) => {
		return request.put('/api/role', role);
	},
	getRoleMenus(roleId: string) {
		return request.get<string[]>('/api/role/menu/list', {
			params: { id: roleId }
		});
	},
	setRoleMenus(checkedKeys: string[], roleId: string) {
		return request.post('/api/role/alloc/menu', {
			menuIds: checkedKeys,
			roleId: roleId
		});
	}
};

export default roleService;
