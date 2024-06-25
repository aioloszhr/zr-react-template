import request from '@/request';

export interface LoginDTO {
	userName: string;
	password: string;
	captchaId: string;
	captcha: string;
	publicKey: string;
}

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
	},

	// 登录
	login: (loginDTO: LoginDTO) => {
		return request.post<TokenDTO>('/api/auth/login', loginDTO);
	},

	// 退出登录
	logout() {
		return request.post<TokenDTO>('/api/auth/logout');
	},

	// 获取公钥
	getPublicKey() {
		return request.get<string>('/api/auth/publicKey');
	}
};

export default loginService;
