import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';

const ollamaDev = {
  models: [{ name: 'gemma3:270m' }],
  serverAddress: 'http://127.0.0.1:11434',
};

const ollamaProd = {
  models: [{ name: 'gemma3n:e4b' }],
  serverAddress: 'https://my-deployment',
  requestHeaders: async (params) => {
    //const headers = await fetchWithAuthHeader(params.serverAddress);
    //return { Authorization: headers['Authorization'] };
  },
};

const ai = genkit({
  plugins: [ollama(isDevEnv() ? ollamaDev : ollamaProd)],
});

