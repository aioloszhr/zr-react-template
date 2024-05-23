import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		/**
		 * 预设别名
		 * - @: src 根目录
		 */
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@mock': path.resolve(__dirname, './mock')
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "./src/styles/mixins.scss" as *;`
			}
		}
	},
	plugins: [
		react(),
		/** 创建雪碧图 */
		createSvgIconsPlugin({
			/** 指定需要缓存的图标文件夹 */
			iconDirs: [path.resolve(process.cwd(), 'src/icons')],
			/** 指定symbolId格式 */
			symbolId: 'icon-[dir]-[name]',
			/** 自定义插入的位置 默认body-last*/
			inject: 'body-last',
			/** 自定义dom的id */
			customDomId: '__svg__icons__dom__'
		}),
		/** mock-dev-server配置 */
		mockDevServerPlugin({
			include: ['mock/**/*.mock.ts'],
			exclude: [
				'**/node_modules/**',
				'**/test/**',
				'**/cypress/**',
				'src/**',
				'**/.vscode/**',
				'**/.git/**',
				'**/dist/**',
				'mock/shared/**'
			],
			reload: true,
			build: true
		})
	],
	/** 开发服务器配置 */
	server: {
		port: 8080,
		proxy: {
			'/zhyy': {
				target: 'https://10.188.58.44:8081',
				changeOrigin: true,
				secure: false
			}
		}
	}
});
