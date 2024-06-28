import { TinyArea } from '@antv/g2plot';
import { useLayoutEffect, useRef } from 'react';

const DemoTinyArea = () => {
	const container = useRef(null);

	useLayoutEffect(() => {
		const data = [0, 300, 438, 287, 309, 600, 900, 575, 563, 300, 200];

		const tinyArea = new TinyArea(container.current!, {
			height: 95,
			data,
			smooth: true,
			areaStyle: {
				fill: 'l(360) 1:rgba(98,0,234,0.65)  0.5:rgba(177,128,245,0.5)  0.5:rgba(177,128,245,0.5)'
			}
		});

		tinyArea.render();

		return () => {
			tinyArea.destroy();
		};
	}, []);

	return <div ref={container} className='w-[100%]'></div>;
};

export default DemoTinyArea;
