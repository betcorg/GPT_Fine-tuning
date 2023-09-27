import fs from 'fs';

let dataset = '';

function datasetGen() {

    const dataObj = JSON.parse(fs.readFileSync('input_data/test_data.json', 'utf8'));
    const stream = fs.createWriteStream('./dataset.jsonl');

    for (let i = 0; i < dataObj.length; i++) {
        let q, a = {};
        if (dataObj[i].role === 'user') {
            q = dataObj[i].content;
            a = dataObj[i + 1].content;

            const dialog =  `{"messages": [{"role": "system", "content": "Eres un vendedor carsmático, experto en cierres de ventas"}, {"role": "user", "content": ${JSON.stringify(q)}}, {"role": "assistant", "content": ${JSON.stringify(a)}}]}`;

            stream.write(dialog + '\n');
        }
    }
   stream.end();
}



datasetGen();



//{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}





