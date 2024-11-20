import OpenAI from "openai";
import 'dotenv/config';
const openai = new OpenAI();





async function main() {
  const model = await openai.models.del("ft:gpt-3.5-turbo-0613:personal::83eLfxhO");

  console.log(model);
}
main();