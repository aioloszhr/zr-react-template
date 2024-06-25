export const modules = import.meta.glob('../views/*/index.tsx');

export const componentPaths = Object.keys(modules).map((path: string) =>
	path.replace('../views', '')
);

export const components = Object.keys(modules).reduce<Record<string, () => Promise<any>>>(
	(prev, path: string) => {
		const formatPath = path.replace('../views', '');
		prev[formatPath] = async () => {
			// 这里其实就是动态加载js，如果报错了说明js资源不存在
			return (await modules[path]()) as any;
		};
		return prev;
	},
	{}
);
