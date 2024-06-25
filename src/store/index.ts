import { create } from 'zustand';

import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type State = {
	token: string;
	refreshToken: string;
	collapsed: boolean;
};

type Action = {
	setToken: (token: State['token']) => void;
	setRefreshToken: (refreshToken: State['refreshToken']) => void;
	setCollapsed: (collapsed: State['collapsed']) => void;
};

export const useGlobalStore = create<State & Action>()(
	devtools(
		persist(
			set => ({
				token: '',
				refreshToken: '',
				collapsed: true,
				setToken: (token: State['token']) => {
					set({ token });
				},
				setRefreshToken: (refreshToken: State['refreshToken']) => {
					set({ refreshToken });
				},
				setCollapsed: (collapsed: State['collapsed']) => {
					set({ collapsed });
				}
			}),
			{ name: 'globalStore', storage: createJSONStorage(() => localStorage) }
		),
		{ name: 'globalStore' }
	)
);
