import fs from 'fs';

// Sets the origin data file for generating formatted JSONL file.
const dialoguesFile = './dialogues_json/dialogues.json'

// Sets the path where JSONL file will be created.
const trainingData = './training_data/training_data.jsonl'

// Sets the system content instruction.
const systemContent = 'Eres un vendedor carismático, experto en cierres de ventas';

/************************************************* */

// Filters stresses and special characters from spanish.
function normalizer(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Reads the JSON file and generates a JSONL file storing formatted examples.
// Writes an example of conversation on each line of JSONL file
// as refered in official documentation for fine-tuning gpt-3.5-turbo:
// https://platform.openai.com/docs/guides/fine-tuning/example-format
function datasetGenerator() {

    const dataSet = JSON.parse(fs.readFileSync(dialoguesFile, 'utf8'));
    const stream = fs.createWriteStream(trainingData);
    console.log('[*] Generating JSONL formatted file for fine-tunning your model\n');

    for (let i = 0; i < dataSet.length; i++) {
        let q, a = {};
        if (dataSet[i].role === 'user') {
            q = JSON.stringify(dataSet[i].content);
            a = JSON.stringify(dataSet[i + 1].content);
            const formattedDataset = `{"messages": [{"role": "system", "content": "${systemContent}"}, {"role": "user", "content": ${q}}, {"role": "assistant", "content": ${a}}]}`;
            stream.write(normalizer(formattedDataset) + '\n');
        }
    }
    stream.end();
    console.log(`[*] Formatted JSONL file ready at ${trainingData} `);
}


function main() {
    // If dilaogues file does not exists then will be required.
    try {
        if (fs.accessSync(dialoguesFile)) {
            datasetGenerator();
        }
    } catch (e) {
        console.log(`[*] Please privide a JSON file with some examples of training data ${dialoguesFile}`);
    }    
}
main();




// Example of a training dialog: {"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}





