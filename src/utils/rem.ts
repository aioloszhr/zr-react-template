import { debounce } from 'lodash-es';

/**
 * 	动态计算根元素font-size值
 * 	以1920px 底图为准开发页面
 *	1920 默认大小16px; 1920px = 120rem ;每个元素px基础上/16
 */
const setRem = (): void => {
	const screenWidth = 1920;
	const scale = screenWidth / 16;
	const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
	// 得到html的Dom元素
	const htmlDom = document.getElementsByTagName('html')[0];
	// 设置根元素字体大小
	htmlDom.style.fontSize = htmlWidth / scale + 'px';
};

setRem();

const setRemDebounce = debounce(setRem, 400);

// window.addEventListener('resize', setHtmlFontSizeDebounce); // 浏览器加入收缩监听防抖，重新计算rem配置

// 改变窗口大小时重新设置 rem
window.onresize = function () {
	setRemDebounce();
};
