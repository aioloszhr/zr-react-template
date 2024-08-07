import React, { useEffect, lazy, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MessageHandle from './components/message-handle';
import Sider from './components/Sider';
import Header from './components/Header';
import Content from './components/content';
import TabsLayout from './components/tabs-layout';
import { useGlobalStore } from '@/store';
import { useUserStore } from '@/store/user';
import { useMessageStore } from '@/store/message';
import { useRequest } from '@/hooks/use-request';
import { useWebSocketMessage } from '@/hooks/use-websocket';
import userService from '@/views/user/service';
import { replaceRoutes, router } from '@/router';
import { components } from '@/config/routes';
import { MenuType } from '@/views/menu/interface';
import Result404 from '@/views/404';

import type { SocketMessage } from '@/store/message';
import type { Menu } from '@/views/user/service';

import './index.scss';
import GloablLoading from '@/components/global-loading/index.tsx';

const BasicLayout: React.FC = () => {
	const { refreshToken, token } = useGlobalStore();
	const { setCurrentUser, currentUser } = useUserStore();
	const { setLatestMessage } = useMessageStore();

	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(true);

	const { data: currentUserDetail, run: getCurrentUserDetail } = useRequest(
		userService.getCurrentUserDetail,
		{
			manual: true
		}
	);
	// 当获取完用户信息后，手动连接
	const { latestMessage, connect } = useWebSocketMessage(
		`${window.location.protocol.replace('http', 'ws')}//${window.location.host}/ws/?token=${token}`,
		{ manual: true }
	);

	const formatMenus = (
		menus: Menu[],
		menuGroup: Record<string, Menu[]>,
		routes: Menu[],
		parentMenu?: Menu
	): Menu[] => {
		return menus.map(menu => {
			const children = menuGroup[menu.id];

			const parentPaths = parentMenu?.parentPaths || [];
			const path = (parentMenu ? `${parentPaths.at(-1)}${menu.route}` : menu.route) || '';

			routes.push({ ...menu, path, parentPaths });

			return {
				...menu,
				path,
				parentPaths,
				children: children?.length
					? formatMenus(children, menuGroup, routes, {
							...menu,
							parentPaths: [...parentPaths, path || ''].filter(o => o)
						})
					: undefined
			};
		});
	};

	useEffect(() => {
		if (latestMessage?.data) {
			try {
				const socketMessage = JSON.parse(latestMessage?.data) as SocketMessage;
				setLatestMessage(socketMessage);
			} catch {
				console.error(latestMessage?.data);
			}
		}
	}, [latestMessage]);

	useEffect(() => {
		if (!refreshToken) {
			navigate('/user/login');
			return;
		}
		getCurrentUserDetail();
	}, [navigate, refreshToken, getCurrentUserDetail]);

	useEffect(() => {
		if (!currentUserDetail) return;

		const { menus = [] } = currentUserDetail;

		const menuGroup = menus.reduce<Record<string, Menu[]>>((prev, menu) => {
			if (!menu.parentId) {
				return prev;
			}

			if (!prev[menu.parentId]) {
				prev[menu.parentId] = [];
			}

			prev[menu.parentId].push(menu);
			return prev;
		}, {});

		const routes: Menu[] = [];

		currentUserDetail.menus = formatMenus(
			menus.filter(o => !o.parentId),
			menuGroup,
			routes
		);

		currentUserDetail.authList = menus
			.filter(menu => menu.type === MenuType.BUTTON && menu.authCode)
			.map(menu => menu.authCode!);

		replaceRoutes('*', [
			...routes.map(menu => {
				return {
					path: `/*${menu.path}`,
					Component: menu.filePath ? lazy(components[menu.filePath]) : null,
					id: `/*${menu.path}`,
					handle: {
						parentPaths: menu.parentPaths,
						path: menu.path,
						name: menu.name,
						icon: menu.icon
					}
				};
			}),
			{
				id: '*',
				path: '*',
				Component: Result404,
				handle: {
					path: '404',
					name: '404'
				}
			}
		]);

		setCurrentUser(currentUserDetail);
		setLoading(false);

		// 连接websocket
		connect && connect();

		// replace一下当前路由，为了触发路由匹配
		router.navigate(`${location.pathname}${location.search}`, { replace: true });
	}, [currentUserDetail, setCurrentUser]);

	useEffect(() => {
		function storageChange(e: StorageEvent) {
			if (e.key === useGlobalStore.persist.getOptions().name) {
				useGlobalStore.persist.rehydrate();
			}
		}

		window.addEventListener<'storage'>('storage', storageChange);

		return () => {
			window.removeEventListener<'storage'>('storage', storageChange);
		};
	}, []);

	/** 动态路由加载完成后，才开始渲染页面，否则会出现白屏问题 */
	if (loading || !currentUser) {
		return <GloablLoading />;
	}

	return (
		<div className='overflow-hidden'>
			<MessageHandle />
			<Header />
			<Sider />
			<Content>
				<TabsLayout />
			</Content>
		</div>
	);
};

export default BasicLayout;
