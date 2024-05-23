import type { RouteObject } from 'react-router';

export interface MetaProps {
	keepAlive?: boolean;
	order?: number;
}

export type AppRouteObject = Omit<RouteObject, 'children' | 'index'> & {
	name?: string;
	meta?: MetaProps;
	children?: AppRouteObject[];
};

export interface RouteModules {
	[propName: string]: {
		default: AppRouteObject;
	};
}
