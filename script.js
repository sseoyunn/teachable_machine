// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./model/";

let model, webcam, labelContainer, maxPredictions, predictText;
let predictValue = [0.0, 0.0, 0.0];

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();



    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    var parent = document.getElementById("webcam-container");
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
     }
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    labelText = document.getElementById("label-text");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }



    if (prediction[0].probability.toFixed(2) >= 0.8) { // 가위 인식
        predictText = "가위✌️";
    } else if (prediction[1].probability.toFixed(2) >= 0.8) { // 주먹 인식
        predictText = "바위✊";
    } else if (prediction[2].probability.toFixed(2) >= 0.8) { // 보 인식
        predictText = "보🖐️";
    } else { // 인식 불가
        predictText = "???";
    }

    labelText.innerHTML = '당신은 ' + predictText + '를 내셨군요!';
    answeringText = document.getElementById("answering-text");


    if (prediction[0].probability.toFixed(2) >= 0.8){ // 가위를 냈을 경우
        answeringText.innerHTML = 'AI는 주먹을 냈습니다!'
    }

    else if (prediction[1].probability.toFixed(2) >= 0.8){ // 주먹을 냈을 경우
        answeringText.innerHTML = 'AI는 보를 냈습니다!'
    }
    
    else if (prediction[2].probability.toFixed(2) >= 0.8){ // 보를 냈을 경우
        answeringText.innerHTML = 'AI는 가위를 냈습니다!'
    }

    else { // 인식 안됨
        answeringText.innerHTML = "정확히 가위/바위/보를 내주세요!"
    }
    
}