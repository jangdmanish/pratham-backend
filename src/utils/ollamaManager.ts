import { ChatOllama } from "@langchain/ollama";

export default class OllamaLLMManager {
  private static instance : OllamaLLMManager;
  private llm : ChatOllama;

  private constructor() {
    this.llm = new ChatOllama({
      model: "llama3.2:1b",
      temperature: 0,
      maxRetries: 2,
      streaming:true,
      think:false,
      // other params...
    });
  }

  public static getInstance() : OllamaLLMManager{
    if (!OllamaLLMManager.instance){
      OllamaLLMManager.instance = new OllamaLLMManager();
    }
    return OllamaLLMManager.instance;
  }

  public getLLM () : ChatOllama{
    return this.llm; 
  }
}