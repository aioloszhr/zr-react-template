import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, App as AntdApp } from 'antd';
import Router from '@/router';

const px2rem = px2remTransformer({
	precision: 2
});

const App: React.FC = () => {
	return (
		<ConfigProvider>
			<StyleProvider transformers={[px2rem]}>
				<AntdApp>
					<Router />
				</AntdApp>
			</StyleProvider>
		</ConfigProvider>
	);
};

export default App;
