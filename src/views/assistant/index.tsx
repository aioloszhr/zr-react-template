import React, { useState } from 'react';
import { Button, Input, Space } from 'antd';

const Assistant: React.FC = () => {
	const [keywords, setKeywords] = useState<any>('');
	const [messages, setMessages] = useState<any>('');

	const sendMessage = () => {
		const eventSource = new EventSource(
			`/api/langchain-chat/vector-data?user_query=${keywords}`
		);

		eventSource.onmessage = event => {
			const newMessage = JSON.parse(event.data);
			const { isEnd, data } = newMessage;
			if (!isEnd) {
				setMessages(data);
			} else {
				eventSource.close();
			}
		};

		eventSource.onerror = () => {
			eventSource.close();
		};
	};

	return (
		<div>
			<Space.Compact style={{ width: '100%' }}>
				<Input
					placeholder='发送消息'
					value={keywords}
					onChange={e => {
						setKeywords(e.target.value);
					}}
				/>
				<Button type='primary' onClick={sendMessage}>
					发送
				</Button>
			</Space.Compact>
			{messages}
		</div>
	);
};
export default Assistant;
