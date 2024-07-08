import request from '@/request';

const assistantService = {
	question: () => {
		return request.get<any>('/api/langchain-chat/sse');
	}
};

export default assistantService;
