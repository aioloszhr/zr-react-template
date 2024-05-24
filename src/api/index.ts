import axios from 'axios';
import { message } from 'antd';
import { checkStatus } from './helpers/checkStatus';

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
// import { AXIOS_CONFIG } from '@/config'
import type { AxiosConfig, ResultData } from '@/types';

/** axios 相关配置 */
export const config: AxiosConfig = {
	baseURL: '/api', // `const { MODE } = getAppEnvironment()`,
	withCredentials: false, // 是否允许跨域携带 `cookie`
	timeout: 5 * 1000,
	headers: {
		'Content-Type': 'application/json'
	}
};

class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosConfig) {
		// 实例化axios
		this.service = axios.create(config);

		/**
		 * 请求拦截器
		 * @description 客户端发送请求 -> [请求拦截器] -> 服务器
		 * @description token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
		 */
		this.service.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				config.headers.set('x-access-token', '123');
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data } = response;
				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
				// 请求超时单独判断，请求超时没有 response
				if (error.message.indexOf('timeout') !== -1) message.error('请求超时，请稍后再试');
				// 根据响应的错误状态码，做不同的处理
				if (response) checkStatus(response.status);
				// 服务器结果都没有返回(可能服务器错误可能客户端断网) 断网处理:可以跳转到断网页面
				// if (!window.navigator.onLine) window.location.hash = '/500';
				return Promise.reject(error);
			}
		);
	}

	// * 常用请求方法封装
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
}

export default new RequestHttp(config);
