import React from 'react';
import { Button, Dropdown, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@/store';
import { useUserStore } from '@/store/user';
import { IconBuguang } from '@/assets/icons/buguang';
import { useRequest } from '@/hooks/use-request';
import loginService from '@/views/login/service';

const Header: React.FC = () => {
	const { collapsed, setCollapsed } = useGlobalStore();
	const { currentUser } = useUserStore();

	const { runAsync } = useRequest(loginService.logout, { manual: true });

	const logout = async () => {
		const [error] = await runAsync();
		if (error) return;

		useGlobalStore.setState({
			token: '',
			refreshToken: ''
		});
	};

	return (
		<div className='flex justify-between items-center'>
			<Button
				type='text'
				icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				onClick={() => setCollapsed(!collapsed)}
				className='collapse-button'
			/>
			<div>
				<Dropdown
					trigger={['click']}
					placement='bottomLeft'
					getPopupContainer={node => node.parentElement!}
					dropdownRender={() => {
						return (
							<div
								style={{
									boxShadow: 'rgba(0, 0, 0, 0.08) 0px 6px 30px'
								}}
								className='bg-white rounded-lg w-[200px]'
							>
								<div className='p-[16px]'>
									<p className='text-[16px] text-[rgb(17,25,39)] '>
										{currentUser?.nickName}
									</p>
									<p className='text-[rgb(108,115,127)] mt-[10px]'>
										{currentUser?.phoneNumber}
									</p>
									<p className='text-[rgb(108,115,127)] mt-[0px]'>
										{currentUser?.email}
									</p>
								</div>
								<hr
									style={{ borderWidth: '0 0 thin' }}
									className='m-[0] border-solid border-[rgb(242,244,247)]'
								/>
								<div className='p-[16px] text-center'>
									<Button onClick={logout} type='text' size='small'>
										退出登录
									</Button>
								</div>
							</div>
						);
					}}
				>
					<div className='pl-[10px] pr-[14px] flex items-center justify-between h-[48px] w-[92px] text-[20px] bg-[rgb(227,242,253)] text-[rgb(30,136,229)] hover:bg-[rgb(33,150,243)] hover:text-[rgb(227,242,253)] cursor-pointer'>
						{currentUser?.avatarPath ? (
							<Avatar
								style={{ verticalAlign: 'middle' }}
								src={currentUser.avatarPath}
							/>
						) : (
							<Avatar
								style={{ backgroundColor: 'gold', verticalAlign: 'middle' }}
								icon={<IconBuguang />}
							/>
						)}
						<SettingOutlined />
					</div>
				</Dropdown>
			</div>
		</div>
	);
};
export default Header;
