import React, { useEffect, useState } from 'react';
import { getMenuList } from '@/api/modules/login';
import { Menu } from 'antd';

const LayoutMenu: React.FC = () => {
	const [menuList, setMenuList] = useState([]);

	const getMenuData = async () => {
		const { data } = await getMenuList();
		console.log('data', data);
		setMenuList(data);
	};

	useEffect(() => {
		getMenuData();
	}, []);

	return <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']} items={menuList} />;
};

export default LayoutMenu;
