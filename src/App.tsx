import router from '@/router';
import { RouterProvider } from 'react-router-dom';
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';

const px2rem = px2remTransformer({
	precision: 2
});

const App: React.FC = () => {
	return (
		<StyleProvider transformers={[px2rem]}>
			<RouterProvider router={router} />
		</StyleProvider>
	);
};

export default App;
