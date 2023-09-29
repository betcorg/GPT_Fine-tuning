import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'fs';
import readline from 'readline';

const openai = new OpenAI();

// Sets the origin of training data JSONL file.
const trainingData = './training_data/training_data.jsonl';

// Sets the path where the output file will be stored.
// The id contained in the object file will be used for fine-tuning our model
const uploadedFile = './info/uploaded_file.json'

/******************************************************* */

// Uploades the training data file to Openai
async function uploadFile() {
    let file = await openai.files.create({
        file: fs.createReadStream(trainingData),
        purpose: 'fine-tune'
    });
    // Tracks the file status and generates a file to store the output at info/uploaded_file.json
    while (true) {
        file = await openai.files.retrieve(file.id);
        console.log(`[*] File status: ${file.status}`);

        if (file.status === "processed") {
            console.log('[*] File uploaded succesfully! \n');
            console.log(`[*] Uploded file:
            ${file} \n
            `);
            fs.writeFileSync(uploadedFile, JSON.stringify(file), 'utf8');
            console.log(`
            [*] Checkout the output data at ${uploadedFile}
            `);
            break;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
}


async function main() {

    const rl = readline.createInterface(
      process.stdin,
      process.stdout);
    rl.setPrompt(`Are you sure you want to upload this file? \n
    File: ${trainingData} \n
    [y] [n]  >> `);
    rl.prompt();
    rl.on('line', (answer) => {
  
      if (answer === 'yes' || answer === 'y') {
  
        // uploadFile();
        console.log('Uploading started');
  
      } else if (answer === 'no' || answer === 'n') {
        console.log('Canceled');
      } else {
        console.log('Error: wrong answer');
      }
      rl.close();
    });
  }
  
  main();