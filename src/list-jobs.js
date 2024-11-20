import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function listJobs() {
    let list = await openai.fineTuning.jobs.list();
    for await (const fineTune of list) {
        console.log(fineTune);
    }
}


listJobs();