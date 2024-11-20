import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI();


async function listFiles() {
    const file = await openai.files.list();
    for await (const f of file) {
        console.log(f);
    }
}

listFiles();