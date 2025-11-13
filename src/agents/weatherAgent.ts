import { createAgent, tool } from "langchain";
import * as z from "zod";
import OllamaLLMManager from "../utils/ollamaManager.ts";

const getWeather = tool(
  ({ city }) => `It's always sunny in ${city}!`,
  {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
      city: z.string().describe('The city to get the weather for'),
    }),
  },
);

export default OllamaLLMManager.getInstance().getLLM().bindTools([getWeather]);