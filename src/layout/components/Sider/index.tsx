import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useMatches } from 'react-router-dom';
import { Menu } from 'antd';
import { useUserStore } from '@/store/user';
import { antdIcons } from '@/assets/add-icons';

import type { ItemType } from 'antd/es/menu/interface';
import type { Menu as MenuType } from '@/views/user/service';

const Sider = () => {
	const matches = useMatches();
	const { currentUser } = useUserStore();

	const [selectKeys, setSelectKeys] = useState<string[]>([]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	const treeMenuData = useCallback((menus: MenuType[]): ItemType[] => {
		return menus.map((menu: MenuType) => {
			const children = menu?.children?.filter(menu => menu.show) || [];
			return {
				key: menu.path,
				label: getMenuTitle(menu),
				icon:
					menu.icon && antdIcons[menu.icon] && React.createElement(antdIcons[menu.icon]),
				children: children.length ? treeMenuData(children || []) : null
			};
		});
	}, []);

	const getMenuTitle = (menu: MenuType) => {
		if (menu?.children?.filter(menu => menu.show)?.length) {
			return menu.name;
		}
		return <Link to={menu.path}>{menu.name}</Link>;
	};

	const menuData = useMemo(() => {
		return treeMenuData(currentUser?.menus?.filter(menu => menu.show) || []);
	}, [currentUser]);

	useEffect(() => {
		const [match] = matches;
		if (match) {
			// 获取当前匹配的路由，默认为最后一个
			const route = matches.at(-1);
			// 从匹配的路由中取出自定义参数
			const handle = route?.handle as any;
			// 从自定义参数中取出上级path，让菜单自动展开
			setOpenKeys(handle?.parentPaths || []);
			// 让当前菜单和所有上级菜单高亮显示
			setSelectKeys([...(handle?.parentPaths || []), handle?.path] || []);
		}
	}, [matches]);

	return (
		<Menu
			className='bg-primary color-transition'
			mode='inline'
			style={{ height: '100%', borderRight: 0 }}
			selectedKeys={selectKeys}
			items={menuData}
			openKeys={openKeys}
			onOpenChange={setOpenKeys}
		/>
	);
};
export default Sider;
