export enum MenuType {
	DIRECTORY = 1,
	MENU,
	BUTTON,
	LowCodePage
}

export const MenuTypeName = {
	[MenuType.DIRECTORY.toString()]: '目录',
	[MenuType.MENU.toString()]: '菜单',
	[MenuType.BUTTON.toString()]: '按钮'
};

export interface Menu {
	parentId?: string;
	name?: string;
	icon?: string;
	type?: number;
	route?: string;
	filePath?: string;
	orderNumber?: number;
	url?: string;
	show?: boolean;
	id: string;
	_loaded_?: boolean;
	hasChild?: boolean;
	children?: Menu[] | null;
}
