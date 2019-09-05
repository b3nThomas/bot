<template>
    <div>
        <button
            class="record"
            ref="record"
            @click="toggleRecord">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32px"
                height="32px"
                viewBox="0 0 32 32"
                version="1.1">
                <g>
                    <path d="M 24.277344 15.449219 C 23.972656 15.449219 23.722656 15.695312 23.722656 16 L 23.722656 19.308594 C 23.722656 23.570312 20.257812 27.035156 16 27.035156 C 11.742188 27.035156 8.277344 23.570312 8.277344 19.308594 L 8.277344 16 C 8.277344 15.695312 8.027344 15.449219 7.722656 15.449219 C 7.417969 15.449219 7.171875 15.695312 7.171875 16 L 7.171875 19.308594 C 7.171875 23.992188 10.839844 27.824219 15.449219 28.109375 L 15.449219 30.898438 L 12.691406 30.898438 C 12.386719 30.898438 12.136719 31.144531 12.136719 31.449219 C 12.136719 31.753906 12.386719 32 12.691406 32 L 19.308594 32 C 19.613281 32 19.863281 31.753906 19.863281 31.449219 C 19.863281 31.144531 19.613281 30.898438 19.308594 30.898438 L 16.550781 30.898438 L 16.550781 28.109375 C 21.160156 27.824219 24.828125 23.992188 24.828125 19.308594 L 24.828125 16 C 24.828125 15.695312 24.582031 15.449219 24.277344 15.449219 Z M 24.277344 15.449219 "/>
                    <path d="M 16 25.378906 C 19.347656 25.378906 22.070312 22.65625 22.070312 19.308594 L 22.070312 6.070312 C 22.070312 2.722656 19.347656 0 16 0 C 12.652344 0 9.929688 2.722656 9.929688 6.070312 L 9.929688 19.308594 C 9.929688 22.65625 12.652344 25.378906 16 25.378906 Z M 16 25.378906 "/>
                </g>
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            audioAccessGranted: false,
            audioContext: null,
            audioAnalyser: null,
            audioProcessor: null,
            micInput: null,
            microphone: null,
            stream: null
        }
    },
    mounted() {
        this.checkForMicrophonePermissions();
    },
    methods: {
        checkForMicrophonePermissions() {
            navigator.permissions.query({ name: 'microphone' })
                .then(result => {
                    if (result.state === 'granted') {
                        this.$refs['record'].classList.add('permitted');
                        this.audioAccessGranted = true;
                    }
                })
            ;
        },
        createAudioContext(stream) {
            console.log('CREATE AUDIO');
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext({ sampleRate: 44100 });
            if (!this.audioContext) {
                return console.error('AudioContext not supported. AudioRecorder component unavailable');
            }
            this.micInput = this.audioContext.createGain();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.audioAnalyser = this.audioContext.createAnalyser();
            this.audioProcessor = this.micInput.context.createScriptProcessor(2048, 2, 2);
            this.microphone.connect(this.micInput);
            this.micInput.connect(this.audioAnalyser);
            this.micInput.connect(this.audioProcessor);
            this.audioProcessor.connect(this.micInput.context.destination);
            this.audioProcessor.addEventListener('audioprocess', e => {
                const floatSamples = e.inputBuffer.getChannelData(0);
                console.log('HELLO?');
            });
        },
        accessAudioStream() {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.$refs['record'].classList.add('permitted');
                    this.audioAccessGranted = true;
                    this.createAudioContext(stream);
                })
                .catch(err => {
                    console.error(err);
                })
            ;
        },
        toggleRecord() {
            this.accessAudioStream();
            if (!this.$refs['record'].classList.contains('recording')) {
                this.startRecording();
            } else {
                this.stopRecording();
            }
        },
        startRecording() {
            console.log('Recording started');
            this.$refs['record'].classList.add('recording');
        },
        stopRecording() {
            console.log('Recording stopped');
            this.$refs['record'].classList.remove('recording');
        }
    }
};
</script>

<style scoped>
.record {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    width: 64px;
    margin: 0 auto;
    border-radius: 100%;
    background-color: rgb(110, 110, 110);
    border: 1px solid rgb(190, 190, 190);
    transition: background-color .25s ease, border-color .2s ease, stroke .2s ease, fill .2s ease;
    cursor: pointer;
    outline: none;
    fill: rgb(255, 255, 255);
    stroke: rgb(255, 255, 255);
}

.record.permitted {
    background-color: rgb(69, 153, 66);
    border: 1px solid rgb(87, 199, 83);
}

.record.recording {
    animation-name: recording;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    border: 1px solid rgb(230, 50, 50);
}

@keyframes recording {
    0% {
        background-color: rgb(230, 90, 90);
    }

    50% {
        background-color: rgb(230, 50, 50)
    }

    100% {
        background-color: rgb(230, 90, 90);
    }
}

</style>
