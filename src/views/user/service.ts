import request from '@/request';

export interface Menu {
	id: string;
	parentId?: string;
	name?: string;
	icon?: string;
	type?: number;
	route?: string;
	filePath?: string;
	orderNumber?: number;
	url?: string;
	show?: boolean;
	children?: Menu[];
	path: string;
	Component?: any;
	parentPaths?: string[];
	authCode?: string;
	curVersion?: string;
}

export interface User {
	id: string;
	userName: string;
	nickName: string;
	phoneNumber: string;
	email: string;
	createDate: string;
	updateDate: string;
	avatar?: any;
	menus: Menu[];
	routes: any[];
	flatMenus: Menu[];
	avatarPath: string;
	authList: string[];
}

const userService = {
	/** 分页获取用户列表 */
	getUserListByPage: async (
		{ current, pageSize }: { current: number; pageSize: number },
		formData: any
	) => {
		return await request.get<PageData<User>>('/api/user/page', {
			params: {
				page: current - 1,
				size: pageSize,
				...formData
			}
		});
	},
	/** 获取当前用户信息 */
	getCurrentUserDetail() {
		return request.get<User>('/api/auth/current/user');
	},
	/** 获取角色 */
	getRoles: () => {
		return request.get<any[]>('/api/role/list');
	},
	/** 添加用户 */
	addUser: (data: User) => {
		return request.post('/api/user', data);
	},
	/** 创建用户 */
	updateUser: (data: User) => {
		return request.put('/api/user', data);
	},
	/** 删除用户 */
	deleteUser: (id: number) => {
		return request.delete(`/api/user/${id}`);
	}
};

export default userService;
