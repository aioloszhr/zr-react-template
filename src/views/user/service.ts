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
	id: number;
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
	getCurrentUserDetail() {
		return request.get<User>('/api/auth/current/user');
	}
};

export default userService;
