import request from '@/api';

export interface TokenDTO {
	expire: number;
	token: string;
	refreshExpire: number;
	refreshToken: string;
}

export interface CaptchaDTO {
	id: string;
	imageBase64: string;
}

const loginService = {
	// 刷新token
	refreshToken(refreshToken: string) {
		return request.post<TokenDTO>('/api/auth/refresh/token', { refreshToken });
	},

	// 获取验证码
	getCaptcha: () => {
		return request.get<CaptchaDTO>('/api/auth/captcha');
	}
};

export default loginService;
