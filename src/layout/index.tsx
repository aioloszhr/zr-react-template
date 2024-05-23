import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import './index.scss';

const { Header, Footer, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
	return (
		<Layout className='layout-wrapper'>
			<Sider trigger={null} width={220}>
				Sider
			</Sider>
			<Layout className='layout-wrapper__content'>
				<Header>Header</Header>
				<Content>
					<Outlet />
				</Content>
				<Footer>Footer</Footer>
			</Layout>
		</Layout>
	);
};

export default AppLayout;
