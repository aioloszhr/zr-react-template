import React, { useEffect, lazy, Suspense } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Layout, theme } from 'antd';
import LayoutMenu from './components/Sider';
import LayoutHeader from './components/Header';
import { useGlobalStore } from '@/store';
import { useUserStore } from '@/store/user';
import { useRequest } from '@/hooks/use-request';
import userService from '@/views/user/service';
import { replaceRoutes, router } from '@/router';
import { components } from '@/config/routes';
import Result404 from '@/views/404';

import { MenuType } from '@/views/menu/interface';
import type { Menu } from '@/views/user/service';

import './index.scss';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
	const { refreshToken, collapsed } = useGlobalStore();
	const { setCurrentUser } = useUserStore();

	const navigate = useNavigate();
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();

	const { data: currentUserDetail, run: getCurrentUserDetail } = useRequest(
		userService.getCurrentUserDetail,
		{
			manual: true
		}
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

		// replace一下当前路由，为了触发路由匹配
		router.navigate(`${location.pathname}${location.search}`, { replace: true });
	}, [currentUserDetail, setCurrentUser]);

	return (
		<Layout className='layout-wrapper'>
			<Sider trigger={null} theme='light' collapsible collapsed={collapsed}>
				<LayoutMenu />
			</Sider>
			<Layout className='layout-wrapper__container'>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<LayoutHeader />
				</Header>
				<Content
					className='content'
					style={{
						background: colorBgContainer,
						borderRadius: borderRadiusLG
					}}
				>
					<Suspense fallback={<div>loading...</div>}>
						<Outlet />
					</Suspense>
				</Content>
			</Layout>
		</Layout>
	);
};

export default BasicLayout;
