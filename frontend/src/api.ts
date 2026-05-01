import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SyncResponse {
  message: string;
  documents_processed: number;
  chunks_created: number;
}

export interface AskResponse {
  answer: string;
  sources: string[];
}

export const syncDrive = async (folderId?: string): Promise<SyncResponse> => {
  const response = await api.post('/sync-drive', folderId ? { folder_id: folderId } : {});
  return response.data;
};

export const askQuestion = async (query: string): Promise<AskResponse> => {
  const response = await api.post('/ask', { query });
  return response.data;
};

export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
