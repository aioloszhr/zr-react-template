import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
	return (
		<div>
			Layout
			<Outlet />
		</div>
	);
};

export default Layout;
