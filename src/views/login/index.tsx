import LoginForm from './components/LoginForm';
import loginLeft from '@/assets/images/login-left.png';

import './index.scss';

const Login: React.FC = () => {
	return (
		<div className='w-screen h-screen flex justify-center items-center login-wrapper bg-[#eee] '>
			<div className='flex justify-around items-center w-[94%] h-[94%] bg-[rgba(255,255,255,0.8)]'>
				<div className='basis-[700px] lg:hidden'>
					<img src={loginLeft} alt='login' />
				</div>
				<div className='basis-[400px] lg:basis-1/2 bg-transparent shadow-[2px_3px_7px_#0003] p-10'>
					<h1 className='mb-5 font-bold text-2xl text-center'>aioloszhr-admin</h1>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login;
