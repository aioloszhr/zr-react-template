import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Router from '@/router';

const px2rem = px2remTransformer({
	precision: 2
});

const App: React.FC = () => {
	return (
		<ConfigProvider locale={zhCN}>
			<StyleProvider transformers={[px2rem]}>
				<AntdApp>
					<Router />
				</AntdApp>
			</StyleProvider>
		</ConfigProvider>
	);
};

export default App;
