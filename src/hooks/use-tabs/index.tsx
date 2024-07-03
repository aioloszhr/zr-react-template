import { useCallback, useEffect, useState } from 'react';
import { useMatchRoute } from '../use-match-router';
import { router } from '@/router';

export interface KeepAliveTab {
	title: string;
	routePath: string;
	key: string;
	pathname: string;
	icon?: any;
	children: any;
}

function getKey() {
	return new Date().getTime().toString();
}

export function useTabs() {
	// 存放页面记录
	const [keepAliveTabs, setKeepAliveTabs] = useState<KeepAliveTab[]>([]);
	// 当前激活的tab
	const [activeTabRoutePath, setActiveTabRoutePath] = useState<string>('');

	const matchRoute = useMatchRoute();

	const closeTab = useCallback(
		(routePath: string = activeTabRoutePath) => {
			const index = keepAliveTabs.findIndex(o => o.routePath === routePath);
			if (keepAliveTabs[index].routePath === activeTabRoutePath) {
				if (index >= 0) {
					router.navigate(keepAliveTabs[index - 1].routePath);
				} else {
					router.navigate(keepAliveTabs[index + 1].routePath);
				}
			}
			keepAliveTabs.splice(index, 1);
			setKeepAliveTabs([...keepAliveTabs]);
		},
		[activeTabRoutePath]
	);

	const closeOtherTab = useCallback(
		(routePath: string = activeTabRoutePath) => {
			const tab = keepAliveTabs.find(o => o.routePath === routePath);
			setKeepAliveTabs(prev => prev.filter(o => o.routePath === routePath));
			router.navigate(tab?.pathname || routePath);
		},
		[activeTabRoutePath]
	);

	const refreshTab = useCallback(
		(routePath: string = activeTabRoutePath) => {
			setKeepAliveTabs(prev => {
				const index = prev.findIndex(tab => tab.routePath === routePath);

				if (index >= 0) {
					prev[index].key = getKey();
				}

				return [...prev];
			});
		},
		[activeTabRoutePath]
	);

	useEffect(() => {
		if (!matchRoute) return;

		const existKeepAliveTab = keepAliveTabs.find(o => o.routePath === matchRoute?.routePath);

		// 如果不存在则需要插入
		if (!existKeepAliveTab) {
			setKeepAliveTabs(prev => [
				...prev,
				{
					title: matchRoute.title,
					key: getKey(),
					routePath: matchRoute.routePath,
					pathname: matchRoute.pathname,
					children: matchRoute.children,
					icon: matchRoute.icon
				}
			]);
		} else if (existKeepAliveTab.pathname !== matchRoute.pathname) {
			// 如果是同一个路由，但是参数不同，我们只需要刷新当前页签并且把pathname设置为新的pathname， children设置为新的children
			setKeepAliveTabs(prev => {
				const index = prev.findIndex(tab => tab.routePath === matchRoute.routePath);
				if (index >= 0) {
					prev[index].key = getKey();
					prev[index].pathname = matchRoute.pathname;
					prev[index].children = matchRoute.children;
				}
				return [...prev];
			});
		}

		setActiveTabRoutePath(matchRoute.routePath);
	}, [matchRoute]);

	return {
		tabs: keepAliveTabs,
		activeTabRoutePath,
		closeTab,
		closeOtherTab,
		refreshTab
	};
}
