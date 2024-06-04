import type { CreateAxiosDefaults } from 'axios';

export interface AxiosConfig extends Omit<CreateAxiosDefaults, 'cancelToken'> {}

// * 请求响应参数(不包含data)
export interface Result {
	statusCode: string;
	message: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T;
}
