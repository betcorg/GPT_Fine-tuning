import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'fs';
import readline from 'readline';

const openai = new OpenAI();

// Sets the model to be fine-tuned
const model = 'gpt-3.5-turbo';

// Sets the origin of the formatted JSONL file with training data
const trainingFile = fs.readFileSync('info/uploaded-file.json', 'utf8');

// Extracts the training file id.
const trainingFileId = JSON.parse(trainingFile).id;

// Sets the path an the file where the fine-tuning job information will be stored.
const jobFile = 'info/fine-tune-model.json';

/******************************************************************** */

async function fineTuningJob() {
  console.log(`[*] Start fine-tuning the model:
  [*] Model: ${model} \n 
  [*] File id: ${trainingFileId}
  `);

  const fineTuningJob = await openai.fineTuning.jobs.create({
    training_file: trainingFileId,
    model: model,
  });

  fs.writeFileSync(jobFile, JSON.stringify(fineTuningJob, null, 2), 'utf8');

  console.log(`
    [*] Fine-tuning job created \n
    [*] Check information at ${jobFile}
  `);
}

async function main() {

  const rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt(`Are you sure you want to fine-tune this model? \n
  Model: ${model} \n
  File id: ${trainingFileId} \n
  [y] [n]  >> `);
  rl.prompt();
  rl.on('line', (answer) => {

    if (answer === 'yes' || answer === 'y') {

      // fineTuningJob();
      console.log('Starting fine tuning job ');

    } else if (answer === 'no' || answer === 'n') {
      console.log('Canceled');
    } else {
      console.log('Error: wrong answer');
    }
    rl.close();
  });
}

main();
