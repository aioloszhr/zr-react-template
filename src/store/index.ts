// Zustand 状态共享

import { create } from 'zustand';

import { devtools } from 'zustand/middleware';

type State = {
	accessToken: string;
	refreshToken: string;
};

type Action = {
	setAccessToken: (accessToken: State['accessToken']) => void;
	setRefreshToken: (refreshToken: State['refreshToken']) => void;
};

export const useGlobalStore = create<State & Action>()(
	devtools(set => ({
		accessToken: '',
		refreshToken: '',
		setAccessToken: accessToken => {
			set({ accessToken });
		},
		setRefreshToken: refreshToken => {
			set({ refreshToken });
		}
	}))
);
