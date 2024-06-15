import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { login, getCaptcha } from '@/api/modules/login';
import { useGlobalStore } from '@/store';

import type { FormProps } from 'antd';

type FieldType = {
	userName: string;
	password: string;
	captcha: string;
	captchaId: string;
};

const Logining: React.FC = () => {
	const { setAccessToken, setRefreshToken } = useGlobalStore();
	const [captcha, setCaptcha] = useState<string>('');
	const [captchaId, setCaptchaId] = useState<string>('');
	const navigate = useNavigate();

	useEffect(() => {
		getCaptchaFn();
	}, []);

	const getCaptchaFn = () => {
		getCaptcha().then(res => {
			if (res.code === 200) {
				const { imageBase64, id } = res.data;
				setCaptcha(imageBase64);
				setCaptchaId(id);
			}
		});
	};

	const onFinish: FormProps<FieldType>['onFinish'] = values => {
		values.captchaId = captchaId;
		login({ ...values }).then(res => {
			if (res.code === 200) {
				message.success(res.message);
				const { accessToken, refreshToken } = res.data;
				setAccessToken(accessToken);
				setRefreshToken(refreshToken);
				navigate('/home');
			} else {
				message.error(res.message);
			}
		});
	};

	return (
		<Form name='basic' onFinish={onFinish} autoComplete='off'>
			<Form.Item<FieldType>
				name='userName'
				rules={[{ required: true, message: '请输入用户名!' }]}
			>
				<Input placeholder='请输入用户名' prefix={<UserOutlined />} allowClear />
			</Form.Item>
			<Form.Item<FieldType>
				name='password'
				rules={[{ required: true, message: '请输入密码!' }]}
			>
				<Input.Password placeholder='请输入密码' prefix={<LockOutlined />} allowClear />
			</Form.Item>
			<Form.Item<FieldType>
				name='captcha'
				rules={[{ required: true, message: '请输入验证码!' }]}
			>
				<Input
					placeholder='请输入验证码'
					prefix={<SafetyCertificateOutlined />}
					suffix={<img src={captcha} />}
				/>
			</Form.Item>
			<Form.Item>
				<Button className='w-full' type='primary' htmlType='submit'>
					登录
				</Button>
			</Form.Item>
		</Form>
	);
};

export default Logining;
