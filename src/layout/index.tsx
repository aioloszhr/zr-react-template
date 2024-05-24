import React, { useState } from 'react';
import LayoutMenu from './components/Menu';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';

import './index.scss';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();

	return (
		<Layout className='layout-wrapper'>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className='demo-logo-vertical' />
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
					Content
				</Content>
			</Layout>
		</Layout>
	);
};

export default App;
