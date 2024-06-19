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

	// 是否正在刷新token
	private refreshTokenFlag = false;

	// 请求队列
	private requestQueue: {
		resolve: any;
		config: any;
		type: 'reuqest' | 'response';
	}[] = [];

	private limit = 3; // 最大并发请求数

	private requestingCount = 0; // 当前并发请求数

	public constructor(config?: CreateAxiosDefaults) {
		// 实例化axios
		this.axiosInstance = axios.create(config);

		// 请求拦截器
		this.axiosInstance.interceptors.request.use((axiosConfig: InternalAxiosRequestConfig) =>
			this.requestInterceptor(axiosConfig)
		);

		// 响应拦截器
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

		// 如果同时请求的数量超出设置的最大值，则进入队列不请求。
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
				// 如果已经调用刷新token接口，则不需要再调用。
				if (this.refreshTokenFlag) return;

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

	/** 刷新token接口 */
	private async refreshToken() {
		// 准备刷新token，需要把标记设置成true
		this.refreshTokenFlag = true;

		// 如果刷新token不存在，则跳转到登录页
		const { refreshToken } = useGlobalStore.getState();

		if (!refreshToken) {
			console.log('xxx');
		}

		// 调用刷新接口
		const [error, data] = await loginService.refreshToken(refreshToken);

		// 如果刷新接口报错
		if (error) {
			console.log('xxx');
		}

		// 把新的token设置到新的全局变量中
		useGlobalStore.setState({
			token: data.token,
			refreshToken: data.refreshToken
		});

		this.requestByQueue();
	}

	private requestByQueue() {
		if (!this.requestQueue.length) return;

		// 回放队列里的接口，这里不能使用for循环，因为里面有await，使用for循环会让回放变成同步执行
		Array.from({ length: this.limit - this.requestingCount }).forEach(async () => {
			const record = this.requestQueue.shift();
			if (!record) {
				return;
			}

			const { config, resolve, type } = record;
			if (type === 'response') {
				// 如果响应为401，则取config直接再请求一下就行了
				resolve(await this.request(config));
			} else if (type === 'reuqest') {
				// 如果在请求拦截器中被拦截，只需要执行resolve方法，把config放进去。这里需要把新的token放进去。
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
