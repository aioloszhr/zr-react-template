import React, { Suspense } from 'react';
import { useGlobalStore } from '@/store';
import { defaultSetting } from '@/config/basic';

const Content: React.FC<any> = ({ children }) => {
	const { collapsed } = useGlobalStore();

	return (
		<div
			className='mt-[80px] p-[12px] w-[100%] bg-[#f3f5fa]'
			style={{
				borderRadius: '8px',
				marginLeft: collapsed ? 112 : defaultSetting.siderWidth,
				height: 'calc(100vh - 80px)',
				transition: 'all 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
				width: `calc(100vw - ${collapsed ? 112 : defaultSetting.siderWidth}px)`
			}}
		>
			<div className='m-0 rounded-md h-[100%] z-10'>
				<Suspense fallback={<div>loading...</div>}>{children}</Suspense>
			</div>
		</div>
	);
};
export default Content;
