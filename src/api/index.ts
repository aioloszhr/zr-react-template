import axios from 'axios';
import { useGlobalStore } from '@/store';
import { antdUtils } from '@/utils/antd';
import loginService from '@/views/login/service';

import type {
	AxiosInstance,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
	AxiosResponse,
	CreateAxiosDefaults
} from 'axios';

export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>;

const refreshTokenUrl = '/api/auth/refresh/token';

class Request {
	axiosInstance: AxiosInstance;

	private refreshTokenFlag = false;

	private requestQueue: {
		resolve: any;
		config: any;
		type: 'reuqest' | 'response';
	}[] = [];

	private limit = 3;

	private requestingCount = 0;

	public constructor(config?: CreateAxiosDefaults) {
		// 实例化axios
		this.axiosInstance = axios.create(config);

		/**
		 * 请求拦截器
		 * @description 客户端发送请求 -> [请求拦截器] -> 服务器
		 */
		this.axiosInstance.interceptors.request.use((axiosConfig: InternalAxiosRequestConfig) =>
			this.requestInterceptor(axiosConfig)
		);

		this.axiosInstance.interceptors.response.use(
			(response: AxiosResponse<unknown, unknown>) =>
				this.responseSuccessInterceptor(response),
			(error: any) => this.responseErrorInterceptor(error)
		);
	}

	private async requestInterceptor(axiosConfig: InternalAxiosRequestConfig): Promise<any> {
		if ([refreshTokenUrl].includes(axiosConfig.url || '')) {
			return Promise.resolve(axiosConfig);
		}

		if (this.refreshTokenFlag || this.requestingCount >= this.limit) {
			return new Promise(resolve => {
				this.requestQueue.push({
					resolve,
					config: axiosConfig,
					type: 'reuqest'
				});
			});
		}

		this.requestingCount += 1;

		const { token } = useGlobalStore.getState();
		// 为每个接口注入token
		if (token) {
			axiosConfig.headers.Authorization = `Bearer ${token}`;
		}
		return Promise.resolve(axiosConfig);
	}

	private async responseSuccessInterceptor(response: AxiosResponse<any, any>): Promise<any> {
		if (response.config.url !== refreshTokenUrl) {
			this.requestingCount -= 1;
			if (this.requestQueue.length) {
				this.requestByQueue();
			}
		}

		return Promise.resolve([false, response.data, response]);
	}

	private async responseErrorInterceptor(error: any): Promise<any> {
		this.requestingCount -= 1;
		const { status, config } = error?.response || {};
		if (status === 401) {
			// 如果接口401，把当前接口插入到队列中，然后刷新token
			return new Promise(resolve => {
				this.requestQueue.unshift({ resolve, config, type: 'response' });
				if (this.refreshTokenFlag) return;

				this.refreshTokenFlag = true;
				this.refreshToken();
			});
		} else {
			antdUtils.notification?.error({
				message: '出错了',
				description: error?.response?.data?.message
			});
			return Promise.resolve([true, error?.response?.data]);
		}
	}

	private async refreshToken() {
		// 准备刷新token，需要把标记设置成true
		this.refreshTokenFlag = true;
		const { refreshToken } = useGlobalStore.getState();

		// 如果刷新token不存在，则跳转到登录页
		if (!refreshToken) {
			console.log('xxx');
		}

		// 调刷新接口
		const [error, data] = await loginService.refreshToken(refreshToken);

		if (error) {
			console.log('xxx');
		}

		useGlobalStore.setState({
			refreshToken: data.refreshToken,
			token: data.token
		});

		this.requestByQueue();
	}

	private requestByQueue() {
		if (!this.requestQueue.length) return;

		Array.from({ length: this.limit - this.requestingCount }).forEach(async () => {
			const record = this.requestQueue.shift();
			if (!record) {
				return;
			}

			const { config, resolve, type } = record;
			if (type === 'response') {
				resolve(await this.request(config));
			} else if (type === 'reuqest') {
				this.requestingCount += 1;
				const { token } = useGlobalStore.getState();
				config.headers.Authorization = `Bearer ${token}`;
				resolve(config);
			}
		});
	}

	request<T, D = any>(config: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance(config);
	}

	get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.get(url, config);
	}

	post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.post(url, data, config);
	}

	put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.put(url, data, config);
	}

	delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
		return this.axiosInstance.delete(url, config);
	}
}

const request = new Request({ timeout: 30000 });

export default request;
