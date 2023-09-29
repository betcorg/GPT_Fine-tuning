import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  console.log('Start fine-tuning the model 🏃🏻');

  const trainingFile = fs.readFileSync('info/uploaded_file.json', 'utf8');
  const trainingFileId = JSON.parse(trainingFile).id;

  console.log(trainingFileId);
 
  const fineTuningJob = await openai.fineTuning.jobs.create({
    training_file: trainingFileId,
    model: 'ft:gpt-3.5-turbo-0613:personal::82TVdo4E',
  });

  fs.writeFileSync('info/fine-tune-model.json', JSON.stringify(fineTuningJob, null, 2), 'utf8');

  console.log(`
    Fine-tuning job created ✅
    Check info/fine-tune-model.json
  `);
}

main();
