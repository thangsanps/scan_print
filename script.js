function onScanSuccess(qrCodeMessage) {
    document.getElementById("result").innerHTML = qrCodeMessage;
     setTimeout(() => requestAnimationFrame(scanQRCode), 2000); // Chờ 100ms trước khi quét tiếp tục, tránh lỗi do quét quá nhanh
     
     sendDataToWebhook(qrCodeMessage);
    
    // check in ngay không
    var instantPrint = document.getElementById('instantPrint').checked;
    if(instantPrint) {
        printQRCode(qrCodeMessage); // Gọi hàm in sau khi quét thành công
    }
   
    
    
}

function onScanFailure(error) {
    console.error(error);
}

function startScan() {
    const video = document.getElementById("video");

    // Kiểm tra hỗ trợ các API truy cập camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
                scanQRCode();
            })
            .catch(function (error) {
                console.error("Error accessing video stream: ", error);
            });
    } else {
        console.error("getUserMedia is not supported by this browser.");
    }
}

function scanQRCode() {
    const video = document.getElementById("video");
    const canvasElement = document.createElement("canvas");
    const canvas = canvasElement.getContext("2d");
    const qrResult = document.getElementById("result");

    // Thực hiện quét mã QR từ video stream
    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                onScanSuccess(code.data);
            } else {
                requestAnimationFrame(tick);
            }
        } else {
            requestAnimationFrame(tick);
        }
    }

    tick();
}


window.onload = startScan;