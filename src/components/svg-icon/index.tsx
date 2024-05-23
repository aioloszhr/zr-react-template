import { useMemo } from 'react';
import { completeSize } from '@/utils';

import type { IconProps } from './types';

import './index.scss';

const SvgIcon: React.FC<IconProps> = props => {
	const {
		className,
		style,
		width = 0,
		height = 0,
		size = 14,
		color = 'currentColor',
		...rest
	} = props;

	const symbolId = useMemo(() => {
		return `#icon-${className}`;
	}, [className]);

	const cssVar = useMemo<UnknownObjectKey>(() => {
		return {
			...style,
			'--svg-icon-width': width ? completeSize(width) : completeSize(size),
			'--svg-icon-height': height ? completeSize(height) : completeSize(size)
		};
	}, [width, height, size, style]);

	return (
		<span className='svg-icon' style={cssVar}>
			<svg data-zriconattribute='svg-icon' aria-hidden {...rest}>
				<use xlinkHref={symbolId} fill={color} />
			</svg>
		</span>
	);
};

export default SvgIcon;
