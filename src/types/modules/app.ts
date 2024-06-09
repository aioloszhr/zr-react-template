import type { MenuProps } from 'antd';

/** menu 类型 */
export type MenuItem = Required<MenuProps>['items'][number];

/** 验证码类型 */
export interface CaptchaProps {
	id: string;
	imageBase64: string;
}
