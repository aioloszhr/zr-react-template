import { cloneDeep } from 'lodash-es';

import type { AppRouteObject } from '@/router/types';

const isRootPath = (path: string) => path[0] === '/';

/**
 *
 * @param arr route modules
 * @param result callback expand routes modules result
 * @param path route path
 * @returns callback expand routes modules result
 *
 * @remark 该方法会视 / 开头 path 为根路由
 */
const routePromotion = (arr: AppRouteObject[], result: AppRouteObject[] = [], path = '') => {
	if (!Array.isArray(arr)) {
		return [];
	}

	for (const curr of arr) {
		const newPath = path + (isRootPath(curr.path) ? curr.path : '/' + curr.path);

		if (curr.children?.length) {
			routePromotion(curr.children, result, newPath);

			continue;
		} else {
			result.push({
				...curr,
				path: newPath
			});
		}
	}

	return result;
};

// 获取所有已展开的路由
export const expandRoutes = (arr: AppRouteObject[]) => {
	if (!Array.isArray(arr)) {
		return [];
	}

	return routePromotion(cloneDeep(arr));
};
