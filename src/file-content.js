import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const file = await openai.files.retrieveContent("file-vEyk83w5cIA6VcayEsTnYoez");

  console.log(file);
}

main();