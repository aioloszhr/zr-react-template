import type { RouteModules, AppRouteObject } from '@/router/types';

/**
 *
 * @returns 所有路由模块
 *
 * @remark 自动合并所有路由模块, 每一个 ts 文件都视为一个 route module 与 views 一一对应
 *
 * 请注意, 如果更改了 modules 的目录位置或者该方法的位置, 需要同步更改 import.meta.glob 方法的路径
 * 该方法会以本文件为起始位置去查找对应 URL 目录的资源
 *
 * 会将 modules 中每一个 ts 文件当作一个路由模块, 即使你以分包的形式创建了路由模块
 */
export const combineRawRouteModules = () => {
	const modulesFiles: RouteModules = import.meta.glob('@/router/modules/*.ts', {
		eager: true
	});

	const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
		const route = modulesFiles[modulePath].default;

		if (route) {
			modules.push(route);
		} else {
			throw new Error(
				'router helper combine: an exception occurred while parsing the routing file!'
			);
		}

		return modules;
	}, [] as AppRouteObject[]);

	return modules;
};

/**
 *
 * @param routes 路由模块表(route 表)
 * @returns 排序后的新路由表
 *
 * @remark 必须配置 meta 属性, order 属性会影响页面菜单排序
 *
 * 如果为配置 order 属性, 则会自动按照合并前路由的顺序前后排序
 * 如果 order 属性值相同, 则会按照路由名称进行排序
 */
export const orderRoutes = (routes: AppRouteObject[]) => {
	return routes.sort((curr, next) => {
		const currOrder = curr.meta?.order ?? 1;
		const nextOrder = next.meta?.order ?? 0;

		if (typeof currOrder !== 'number' || typeof nextOrder !== 'number') {
			throw new TypeError('orderRoutes error: order must be a number!');
		}

		if (currOrder === nextOrder) {
			// 如果两个路由的 order 值相同，则按照路由名进行排序
			return curr.name ? (next.name ? curr.name.localeCompare(next.name) : -1) : 1;
		}

		return currOrder - nextOrder;
	});
};
