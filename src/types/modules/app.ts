import type { MenuProps } from 'antd';

/** menu 类型 */
export type MenuItem = Required<MenuProps>['items'][number];

/** captcha 类型 */
export interface CaptchaProps {
	id: string;
	imageBase64: string;
}

/** login 类型 */
export interface LoginProps {
	accessToken: string;
	refreshToken: string;
}
