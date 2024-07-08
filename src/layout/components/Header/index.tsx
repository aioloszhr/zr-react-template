import React from 'react';
import { Input, Dropdown, Button, Avatar } from 'antd';
import { MenuOutlined, SettingOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@/store';
import { useUserStore } from '@/store/user';
import { IconBuguang } from '@/assets/icons/buguang';
import { IconFangdajing } from '@/assets/icons/fangdajing';
import { useRequest } from '@/hooks/use-request';
import loginService from '@/views/login/service';
import { defaultSetting } from '@/config/basic';

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
		<div className='z-[998] h-[80px] flex items-center px-0 fixed top-0 right-0 left-0 bg-white'>
			<div
				style={{ width: collapsed ? 112 : defaultSetting.siderWidth }}
				className='flex items-center gap-[4px] text-[20px] px-[16px]'
			>
				<div className='flex-auto text-center'>
					<IconBuguang className='text-blue-500' />
				</div>
				{!collapsed && (
					<h1 className='flex-auto'>
						<span className='text-primary font-bold text-[22px]'>zr-react-admin</span>
					</h1>
				)}
			</div>
			<div className='flex items-center justify-between flex-1 pr-[24px]'>
				<div className='flex items-center justify-center gap-[16px]'>
					<div
						className='w-[34px] text-[16px] h-[34px] leading-[34px] bg-[rgb(237,231,246)] text-center  text-[rgb(94,53,177)] rounded-[8px] cursor-pointer hover:(bg-[rgb(94,53,177)] text-[rgb(237,231,246)])'
						onClick={() => {
							setCollapsed(!collapsed);
						}}
					>
						<MenuOutlined />
					</div>
					<Input
						style={{
							borderRadius: 8,
							outline: 'none',
							boxShadow: 'none'
						}}
						className='w-[400px] h-[50px] focus:(border-[rgb(135,94,196)])'
						size='large'
						prefix={
							<IconFangdajing
								style={{
									color: '#697586',
									paddingRight: 8
								}}
							/>
						}
						placeholder='搜索菜单'
						allowClear
					/>
				</div>
				<div className='flex gap-[16px] items-center'>
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
		</div>
	);
};
export default Header;
