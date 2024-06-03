import LoginForm from './components/LoginForm';
import loginLeft from '@/assets/images/login_left.png';

import './index.scss';

const Login: React.FC = () => {
	return (
		<div className='login'>
			<div className='login-wrapper'>
				<div className='login-wrapper__left'>
					<img src={loginLeft} alt='login' />
				</div>
				<div className='login-wrapper__content'>
					<div className='title'>React后台管理平台</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login;
