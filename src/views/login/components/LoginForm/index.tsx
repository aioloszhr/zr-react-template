import { useNavigate } from 'react-router-dom';
import JSEncrypt from 'jsencrypt';
import { Form, Input, Button } from 'antd';
import { LockOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import loginService from '@/views/login/service';
import { useGlobalStore } from '@/store';
import { useRequest } from '@/hooks/use-request';

import type { LoginDTO } from '@/views/login/service';
import type { FormProps } from 'antd';

const Logining: React.FC = () => {
	const { setToken, setRefreshToken } = useGlobalStore();
	const navigate = useNavigate();

	const { data: captcha, refresh: refreshCaptcha } = useRequest(loginService.getCaptcha);
	const { runAsync: login, loading } = useRequest(loginService.login, { manual: true });
	const { runAsync: getPublicKey } = useRequest(loginService.getPublicKey, { manual: true });

	const onFinish: FormProps<LoginDTO>['onFinish'] = async values => {
		if (!captcha) {
			return;
		}

		values.captchaId = captcha.id;

		// 获取公钥
		const [error, publicKey] = await getPublicKey();

		if (error) {
			return;
		}

		// 使用公钥对密码加密
		const encrypt = new JSEncrypt();
		encrypt.setPublicKey(publicKey);
		const password = encrypt.encrypt(values.password) as string;

		if (!password) {
			return;
		}

		values.password = password;
		values.publicKey = publicKey;

		const [loginError, data] = await login(values);

		if (loginError) {
			refreshCaptcha();
			return;
		}

		setToken(data.token);
		setRefreshToken(data.refreshToken);

		navigate('/home');
	};

	return (
		<Form name='basic' onFinish={onFinish} autoComplete='off'>
			<Form.Item<LoginDTO>
				name='userName'
				rules={[{ required: true, message: '请输入用户名!' }]}
			>
				<Input placeholder='请输入用户名' prefix={<UserOutlined />} allowClear />
			</Form.Item>
			<Form.Item<LoginDTO>
				name='password'
				rules={[{ required: true, message: '请输入密码!' }]}
			>
				<Input.Password placeholder='请输入密码' prefix={<LockOutlined />} allowClear />
			</Form.Item>
			<Form.Item<LoginDTO>
				name='captcha'
				rules={[{ required: true, message: '请输入验证码!' }]}
			>
				<Input
					placeholder='请输入验证码'
					prefix={<SafetyCertificateOutlined />}
					suffix={<img src={captcha?.imageBase64} onClick={refreshCaptcha} />}
				/>
			</Form.Item>
			<Form.Item>
				<Button className='w-full' type='primary' htmlType='submit' loading={loading}>
					登录
				</Button>
			</Form.Item>
		</Form>
	);
};

export default Logining;
