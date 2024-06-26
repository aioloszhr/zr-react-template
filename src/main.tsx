import ReactDOM from 'react-dom/client';
/** vite-plugin-svg-icons插件，启用 svg 雪碧图 */
import 'virtual:svg-icons-register';
import '@/styles/base.scss';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
