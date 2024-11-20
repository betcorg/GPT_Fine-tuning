import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Start checking the fine-tuning job status');
  const fineTuningJob = JSON.parse(fs.readFileSync('info/fine-tune-model.json', 'utf8'));

  while (true) {
    const currentFineTuningJob = await openai.fineTuning.jobs.retrieve(fineTuningJob.id);

    if (currentFineTuningJob.status === 'succeeded') {
      fs.writeFileSync('info/job-status.json', JSON.stringify(currentFineTuningJob, null, 2), 'utf8');
      console.log(`
        Fine-tuning job completed 
        Fine-tuning info at info/job-status.json
      `);
      break;
    } else {
      console.log(`
        Fine-tuning job not completed yet 
        Checking again in 10 seconds. 
      `);
      await sleep(10000);
    }
  }
}

main();
