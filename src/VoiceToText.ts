import { createReadStream } from 'fs';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';

const options = {
    iam_apikey: '',
    url: 'h'
};

const speechToText = new SpeechToTextV1(options);

export const voiceToTextCallback = audioFile => {
    const recognizeParams = {
        audio: createReadStream(audioFile),
        content_type: 'audio/flac',
    };

    speechToText.recognize(recognizeParams, (err, res) => {
        if (err) {
            return console.error(err);
        }
        console.log(JSON.stringify(res, null, 2));
    });
};
