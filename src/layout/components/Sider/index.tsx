import React from 'react';
import { useGlobalStore } from '@/store';
import { defaultSetting } from '@/config';
import SiderMenu from './menu';

const Sider: React.FC = () => {
	const { collapsed } = useGlobalStore();

	function renderMenu() {
		return <SiderMenu />;
	}

	return (
		<div
			style={{ width: collapsed ? 112 : defaultSetting.siderWidth }}
			className='top-[80px] fixed box-border left-0 bottom-0 overflow-y-auto px-[16px]'
		>
			{renderMenu()}
		</div>
	);
};
export default Sider;
