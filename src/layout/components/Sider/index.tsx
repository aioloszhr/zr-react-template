import { Menu } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [{ key: '1', icon: <PieChartOutlined />, label: 'Option 1' }];

const Sider = () => {
	return <Menu defaultSelectedKeys={['1']} mode='inline' items={items} />;
};
export default Sider;
