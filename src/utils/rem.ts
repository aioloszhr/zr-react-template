/**
 * 	动态计算根元素font-size值
 */
import { debounce } from 'lodash-es';

// 以1920px 底图为准开发页面
export const setHtmlFontSize = (): void => {
	const width = document.documentElement.clientWidth || document.body.clientWidth;
	const fontsize = (width <= 1200 ? 1200 : width) / 100 + 'px';
	(document.getElementsByTagName('html')[0].style as any)['font-size'] = fontsize;
};

const setHtmlFontSizeDebounce = debounce(setHtmlFontSize, 400);
window.addEventListener('resize', setHtmlFontSizeDebounce); // 浏览器加入收缩监听防抖，重新计算rem配置
