import { create } from 'zustand';

import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type State = {
	token: string;
	refreshToken: string;
};

type Action = {
	setToken: (token: State['token']) => void;
	setRefreshToken: (refreshToken: State['refreshToken']) => void;
};

export const useGlobalStore = create<State & Action>()(
	devtools(
		persist(
			set => ({
				token: '',
				refreshToken: '',
				setToken: token => {
					set({ token });
				},
				setRefreshToken: refreshToken => {
					set({ refreshToken });
				}
			}),
			{ name: 'globalStore', storage: createJSONStorage(() => localStorage) }
		),
		{ name: 'globalStore' }
	)
);
