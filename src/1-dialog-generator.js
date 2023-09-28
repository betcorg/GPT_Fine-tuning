import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'fs';
import prompt from '../prompt/prompt_example.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/************************************************* */

const dialoguesFile = './dialogues_json/dialogues.json'

/************************************************* */

// Generates a set of contextual conversations sending buisiness_context.txt file to ChatGPT
// using the prompt in prompt.js file
// Returns a JSON object string with both "user" and "assistant" dialogs
async function completion(prompt) {
    console.log('Processing your data... please wait a few seconds \n');
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'gpt-3.5-turbo',
    });
    console.log('Dialogues created succesfully! \n');
    console.log(`Usage: ${JSON.stringify(completion.usage)} \n`);
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}


//Generates a JSON file from chatGPT response that stores the training dialog exmples.
async function dialogGenerator() {
    let existingDialogues = fs.readFileSync(dialoguesFile, 'utf8'); //string

    let newDialogSet = await completion(prompt);
    let finalDialog = []
    if (existingDialogues) {
        for (const obj of JSON.parse(existingDialogues)) {
            finalDialog.push(obj)
        }
    }
    for (const obj of JSON.parse(newDialogSet)) {
        finalDialog.push(obj);
    }
    fs.writeFileSync(dialoguesFile, JSON.stringify(finalDialog), 'utf8');
    console.log(`Dialogues for generating dataset file are ready at ${dialoguesFile} \n`);
}

async function main() {
    dialogGenerator();
}

main();
