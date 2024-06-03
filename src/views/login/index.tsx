import LoginForm from './components/LoginForm';
import loginLeft from '@/assets/images/login_left.png';

const Login: React.FC = () => {
	return (
		<div className='text-3xl'>
			<div>
				<div>
					<img src={loginLeft} alt='login' />
				</div>
				<div>
					<div>React后台管理平台</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login;
