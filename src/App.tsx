import { RouterProvider } from 'react-router-dom';
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import router from '@/router';

const px2rem = px2remTransformer({
	precision: 2
});

const App: React.FC = () => {
	return (
		<ConfigProvider>
			<StyleProvider transformers={[px2rem]}>
				<RouterProvider router={router} />
			</StyleProvider>
		</ConfigProvider>
	);
};

export default App;
