export const mic = () => {
    const onSuccess = () => {
        console.log('SUCCESS');
    };

    navigator.mediaDevices.getUserMedia().then(() => {
        onSuccess();
    });
};
