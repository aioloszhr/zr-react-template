import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { login } from '@/api/modules/login';

import type { FormProps } from 'antd';

type FieldType = {
	username?: string;
	password?: string;
};

const Logining: React.FC = () => {
	const navigate = useNavigate();

	const onFinish: FormProps<FieldType>['onFinish'] = values => {
		const { username, password } = values;
		login({ username, password }).then(res => {
			if (res.statusCode === '0000') {
				message.success(res.message);
				navigate('/home');
			} else {
				message.error(res.message);
			}
		});
	};

	return (
		<Form
			name='basic'
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 16 }}
			onFinish={onFinish}
			autoComplete='off'
		>
			<Form.Item<FieldType>
				label='用户名'
				name='username'
				rules={[{ required: true, message: '请输入用户名!' }]}
			>
				<Input placeholder='请输入用户名' allowClear />
			</Form.Item>
			<Form.Item<FieldType>
				label='密码'
				name='password'
				rules={[{ required: true, message: '请输入密码!' }]}
			>
				<Input.Password placeholder='请输入密码' allowClear />
			</Form.Item>
			<Form.Item wrapperCol={{ offset: 6, span: 16 }}>
				<Button type='primary' htmlType='submit'>
					登录
				</Button>
			</Form.Item>
		</Form>
	);
};

export default Logining;
