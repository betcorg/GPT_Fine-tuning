import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'fs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// Sets the origin of training data JSONL file.
const trainingData = './training_data/training_data.jsonl';



/******************************************************* */

async function uploadFile() {
    let file = await openai.files.create({
        file: fs.createReadStream(trainingData),
        purpose: 'fine-tune'
    });

    while (true) {
        file = await openai.files.retrieve(file.id);
        console.log(`File status: ${file.status}`);

        if (file.status === "processed") {
            console.log('File processed succesfully \n');
            console.log(file + '\n');
            fs.writeFileSync('./info/uploaded_file.json', JSON.stringify(file), 'utf8');
            console.log(`
            File uploaded to OpenAI
            Check output data at /info/uploaded_file.json
            `);
            break;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

uploadFile();
