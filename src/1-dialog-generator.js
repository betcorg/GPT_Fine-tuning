import OpenAI from 'openai';
import 'dotenv/config';
import fs from 'fs';

const openai = new OpenAI();

// Sets the output file to store dialogues generated by chatGPT.
const dialoguesFile = './dialogues_json/dialogues.json'

// sets the origin of context business file txt. 
const contextFile = './business_context/context_example12.txt';

/************************************************* */

// Generates a set of contextual conversations sending buisiness_context.txt file to ChatGPT.
// Returns a JSON object string with both "user" and "assistant" dialogs.
async function completion(prompt) {
    console.log('Processing your data... please wait a few seconds \n');
    const completion = await openai.chat.completions.create({
        messages: [{
            role: 'user',
            content: prompt,
        }],
        model: 'gpt-3.5-turbo',
    });

    console.log(`
    [*] Dialogues created succesfully! \n
    [*] Token usage:\n 
    ${JSON.stringify(completion.usage)} \n
    [*] Output: \n
    ${completion.choices[0].message.content}) \n`);

    return completion.choices[0].message.content;
}

//Generates a JSON file from chatGPT response that stores the training dialog exmples in dialogues.json.
// Adds new conversations to existing file
async function dialogGenerator(prompt) {

    let existingDialogues = '';
    try {
        if (fs.accessSync(dialoguesFile)) {
            existingDialogues = fs.readFileSync(dialoguesFile, 'utf8');
        }
    } catch (e) {
        fs.writeFileSync(dialoguesFile, '', 'utf8');
    }

    let newDialogSet = await completion(prompt);
    let finalDialog = [];
    if (existingDialogues) for (const obj of JSON.parse(existingDialogues)) finalDialog.push(obj);
    for (const obj of JSON.parse(newDialogSet)) finalDialog.push(obj);
    fs.writeFileSync(dialoguesFile, JSON.stringify(finalDialog), 'utf8');
    console.log(`[*] Dialogues for generating dataset are ready at ${dialoguesFile}`);
}

async function main() {
    // If context file does not exists will be required to continue.
    try {
        fs.accessSync(contextFile, fs.constants.F_OK);
        const prompt = ` ${fs.readFileSync(contextFile, 'utf8')}
        
            Responde solo con código JSON válido, sin errores de sintaxis.
            Basado en los datos anteriores genera un dataset de preguntas y respuestas simulando una conversación entre un prospecto y un vendedor para entrenar un modelo de openai. Cada ejemplo que incluyas deberá tener el siguiente formato: 
            [
                {"role": "user", "content": "[pregunta]"}, 
                {"role": "assistant", "content": "[respuesta]"},
                {"role": "user", "content": "[pregunta]"}, 
                {"role": "assistant", "content": "[respuesta]"}
            ]
            `;
        dialogGenerator(prompt);

    } catch (e) {
        console.log(`[*] Please privide a txt file with your business information at ${contextFile}`);
    }
}
main();
