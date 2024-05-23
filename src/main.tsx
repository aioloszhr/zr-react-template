import React from 'react';
import ReactDOM from 'react-dom/client';
/** vite-plugin-svg-icons插件，启用 svg 雪碧图 */
import 'virtual:svg-icons-register';
import App from './App.tsx';

import '@/styles/reset.scss';
import '@/styles/base.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
