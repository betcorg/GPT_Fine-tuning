import OpenAI from 'openai';
import 'dotenv/config';
const openai = new OpenAI();



const prompt = 'Sobre que trata el curso';



async function completion(prompt) {

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'ft:gpt-3.5-turbo-0613:personal::83cvaLMm',
    });
    console.log(`Usage: ${JSON.stringify(completion.usage)} \n`);
    console.log(completion.choices[0].message.content);
}


completion(prompt);