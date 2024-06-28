// import { useRef } from 'react';
import { useWebSocket } from 'ahooks';

import type { Options, Result } from 'ahooks/lib/useWebSocket';

export function useWebSocketMessage(socketUrl: string, options?: Options): Result {
	// const timerRef = useRef<number>();

	const { latestMessage, sendMessage, connect, disconnect, readyState, webSocketIns } =
		useWebSocket(socketUrl, {
			...options,
			reconnectLimit: 30,
			reconnectInterval: 6000,
			onOpen: (event: Event, instance: WebSocket) => {
				options?.onOpen && options.onOpen(event, instance);
			},
			onMessage: (message: MessageEvent<any>, instance: WebSocket) => {
				options?.onMessage && options.onMessage(message, instance);
			},
			onClose(event, instance) {
				options?.onClose && options.onClose(event, instance);
			},
			onError(event, instance) {
				options?.onError && options.onError(event, instance);
			}
		});

	return {
		latestMessage,
		connect,
		sendMessage,
		disconnect,
		readyState,
		webSocketIns
	};
}
