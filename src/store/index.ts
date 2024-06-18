// Zustand 状态共享

import { create } from 'zustand';

import { devtools } from 'zustand/middleware';

type State = {
	token: string;
	refreshToken: string;
};

type Action = {
	setToken: (token: State['token']) => void;
	setRefreshToken: (refreshToken: State['refreshToken']) => void;
};

export const useGlobalStore = create<State & Action>()(
	devtools(set => ({
		token: '',
		refreshToken: '',
		setToken: token => {
			set({ token });
		},
		setRefreshToken: refreshToken => {
			set({ refreshToken });
		}
	}))
);
