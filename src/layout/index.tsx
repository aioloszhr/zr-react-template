import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Button, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import LayoutMenu from './components/Sider';
import { useGlobalStore } from '@/store';

import './index.scss';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
	const { refreshToken } = useGlobalStore();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();

	useEffect(() => {
		if (!refreshToken) {
			navigate('/');
		}
	}, [navigate, refreshToken]);

	return (
		<Layout className='layout-wrapper'>
			<Sider trigger={null} theme='light' collapsible collapsed={collapsed}>
				<LayoutMenu />
			</Sider>
			<Layout className='layout-wrapper__container'>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type='text'
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						className='collapse-button'
					/>
				</Header>
				<Content
					className='content'
					style={{
						background: colorBgContainer,
						borderRadius: borderRadiusLG
					}}
				>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};

export default BasicLayout;
