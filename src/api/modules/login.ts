import { API_PORT, MOCk_PORT } from '@/api/config';

import http from '@/api';

import type { CaptchaProps, LoginProps } from '@/types';

// 获取菜单列表
export const getMenuList = () => {
	return http.post<Menu.MenuOptions[]>(MOCk_PORT + `/hooks/menu/list`);
};

// 登录
export const login = params => {
	return http.post<LoginProps>(API_PORT + '/auth/login', params);
};

// 获取验证码
export const getCaptcha = () => {
	return http.get<CaptchaProps>(API_PORT + '/auth/captcha');
};
