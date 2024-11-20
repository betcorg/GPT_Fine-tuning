import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI();


async function deleteModel() {

    let fineTunes = await openai.models.retrieve('ft:gpt-3.5-turbo-0613:personal::83cvaLMm')

    console.log(fineTunes);

    // console.log(fineTunes);




}

deleteModel();