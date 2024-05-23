export type BasicIconProps = {
	className: string;
	style?: React.CSSProperties;
	size?: string | number;
	width?: string | number;
	height?: string | number;
	color?: string;
};

export type IconProps = BasicIconProps &
	Omit<React.SVGAttributes<SVGElement>, keyof BasicIconProps>;
