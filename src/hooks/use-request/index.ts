import { useCallback, useEffect, useState } from 'react';
import { Response } from '@/api';

interface RequestOptions {
	manual?: boolean;
	defaultParams?: any[];
}

interface RequestResponse<T> {
	error: boolean | undefined;
	data: T | undefined;
	loading: boolean;
	run(...params: any): void;
	runAsync(...params: any): Response<T>;
}

export function useRequest<T>(
	serviceMethod: (...args: any) => Response<T>,
	options?: RequestOptions
): RequestResponse<T> {
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<T>();
	const [error, setError] = useState<boolean>();

	const resolveData = async () => {
		setLoading(true);
		const [error, requestData] = await serviceMethod(...(options?.defaultParams || []));
		setLoading(false);
		setData(requestData);
		setError(error);
	};

	const runAsync = useCallback(
		async (...params: any) => {
			setLoading(true);
			const res = await serviceMethod(...params);
			setLoading(false);
			return res;
		},
		[serviceMethod]
	);

	const run = useCallback(
		async (...params: any) => {
			setLoading(true);
			const [error, requestData] = await serviceMethod(...params);
			setLoading(false);
			setData(requestData);
			setError(error);
		},
		[serviceMethod]
	);

	useEffect(() => {
		if (!options?.manual) {
			resolveData();
		}
	}, [options]);

	return {
		loading,
		error,
		data,
		run,
		runAsync
	};
}
