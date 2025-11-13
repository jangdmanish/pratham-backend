//import { genkit } from 'genkit';
//import { ollama } from 'genkitx-ollama';
import { spawn } from "node:child_process";
import { ChatOllama } from "@langchain/ollama";
/*const ollamaDev = {
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

//plugins: [ollama(isDevEnv() ? ollamaDev : ollamaProd)],
const ai = genkit({
  plugins: [ollama(ollamaDev)],
});*/

export async function startOllama() {
  // Use 'inherit' to see the ollama output in the main process console
  // or 'ignore' to run it silently.
  const ollamaProcess = spawn('ollama', ['serve'], {
    detached: true, // Allows the child process to run independently of the parent
    stdio: 'ignore' // Hides the output, use 'inherit' for debugging
  });

  ollamaProcess.unref(); // Allows the Node.js application to exit without killing the ollama process
  // Wait a moment for the ollama server to spin up
  await new Promise(resolve => setTimeout(resolve, 5000)); 
  console.log(`Ollama serve process started with PID: ${ollamaProcess.pid}`);
}


export function getOllamaLLM(text?:string){
  return new ChatOllama({
    model: "gemma3:270m",
    temperature: 0,
    maxRetries: 2,
    streaming:true,
    // other params...
})
}

