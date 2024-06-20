/** captcha 类型 */
export interface CaptchaProps {
	id: string;
	imageBase64: string;
}

/** login 类型 */
export interface LoginProps {
	token: string;
	refreshToken: string;
}
