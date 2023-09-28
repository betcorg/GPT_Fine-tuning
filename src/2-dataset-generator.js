import fs from 'fs';

/************************************************* */

const trainingData = './training_data/training_data.jsonl'
const dialoguesFile = './dialogues_json/dialogues.json'

/************************************************* */

// Elimimates stresses and special characters from spanish.
function normalizer(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
}

// Reads the JSON file and generates a JSONL file storing formatted examples.
// Writes an example of conversation on each line of JSONL file
// as refered in official documentation for fine-tuning gpt-3.5-turbo:
// https://platform.openai.com/docs/guides/fine-tuning/example-format
function datasetGenerator() {

    const dataObj = JSON.parse(fs.readFileSync(dialoguesFile, 'utf8'));
    const stream = fs.createWriteStream(trainingData);
    console.log('Generating JSONL formatted file for fine-tunning your model\n');

    for (let i = 0; i < dataObj.length; i++) {
        let q, a = {};
        if (dataObj[i].role === 'user') {
            q = normalizer(dataObj[i].content);
            a = normalizer(dataObj[i + 1].content);
            const formattedDialog = `{"messages": [{"role": "system", "content": "Eres un vendedor carismatico, experto en cierres de ventas"}, {"role": "user", "content": ${JSON.stringify(q)}}, {"role": "assistant", "content": ${JSON.stringify(a)}}]}`;
            stream.write(formattedDialog + '\n');
        };
    };
    stream.end();
    console.log(`Formatted JSONL file ready at ${trainingData} `);
}

/************************************************* */

async function main() {
    datasetGenerator();
}

main();




// Example of a training dialog: {"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}





