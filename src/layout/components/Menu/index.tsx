import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMenuList } from '@/api/modules/login';
import { Menu } from 'antd';
import * as Icons from '@ant-design/icons';

import type { MenuItem } from '@/types';

const LayoutMenu: React.FC = () => {
	const { pathname } = useLocation();
	const [menuList, setMenuList] = useState<MenuItem[]>([]);
	const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);

	const getItem = (
		label: React.ReactNode,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: 'group'
	): MenuItem => {
		return {
			key,
			icon,
			children,
			label,
			type
		} as MenuItem;
	};

	/** 动态渲染 Icon 图标 */
	const customIcons: { [key: string]: any } = Icons;
	const addIcon = (name: string) => {
		return React.createElement(customIcons[name]);
	};

	/** 递归处理后台返回菜单 key 值为 antd 菜单需要的 key 值 */
	const deepLoopFloat = (menuList: Menu.MenuOptions[], newArr: MenuItem[] = []) => {
		menuList.forEach((item: Menu.MenuOptions) => {
			// 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
			if (!item?.children?.length)
				return newArr.push(getItem(item.title, item.path, addIcon(item.icon!)));
			newArr.push(
				getItem(item.title, item.path, addIcon(item.icon!), deepLoopFloat(item.children))
			);
		});
		return newArr;
	};

	const getMenuData = async () => {
		const { data } = await getMenuList();
		if (!data) return;
		setMenuList(deepLoopFloat(data));
	};

	useEffect(() => {
		getMenuData();
	}, []);

	// 刷新页面菜单保持高亮
	useEffect(() => {
		setSelectedKeys([pathname]);
	}, [pathname]);

	return <Menu mode='inline' selectedKeys={selectedKeys} items={menuList} />;
};

export default LayoutMenu;
