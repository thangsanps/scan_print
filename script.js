
function onScanSuccess(qrCodeMessage) {
    var check_confirm = document.getElementById('confirm').checked;
    var check_print = document.getElementById('print').checked;
        //check xác nhận sau khi quét.
        if(check_confirm) {
            document.getElementById('qrInfo').innerHTML = "Thông tin QR: " + qrCodeMessage;
            document.getElementById('qrPopup').style.display = 'block';
        } else {
            document.getElementById("result").innerHTML = qrCodeMessage;
            setTimeout(() => requestAnimationFrame(scanQRCode), 2000); // Chờ 100ms trước khi quét tiếp tục, tránh lỗi do quét quá nhanh
         
            sendDataToWebhook(qrCodeMessage);
            if(check_print) {
                printQRCode(qrCodeMessage); // Gọi hàm in sau khi quét thành công
            }
        }
    }
    
    function confirmInfo(qrCodeMessage) {
        var qrValue = document.getElementById('qrInfo').innerHTML;
        var check_print = document.getElementById('print').checked;
        if(check_print) {
                printQRCode(qrCodeMessage); // Gọi hàm in sau khi quét thành công
            }
        
        document.getElementById('qrPopup').style.display = 'none';
        setTimeout(() => requestAnimationFrame(scanQRCode), 2000); // Chờ 100ms trước khi quét tiếp tục, tránh lỗi do quét quá nhanh
        }

    function onScanFailure(error) {
        console.error(error);
    }

//       function startScan() {
//     const video = document.getElementById("video");

//     // Kiểm tra hỗ trợ các API truy cập camera
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         navigator.mediaDevices.getUserMedia({ video: true })
//             .then(function (stream) {
//                 video.srcObject = stream;
//                 video.play();
//                 scanQRCode();
//             })
//             .catch(function (error) {
//                 console.error("Error accessing video stream: ", error);
//             });
//     } else {
//         console.error("getUserMedia is not supported by this browser.");
//     }


// }

    function scanQRCode() {
        const video = document.getElementById("video");
        const canvasElement = document.createElement("canvas");
        const canvas = canvasElement.getContext('2d', { willReadFrequently: true });
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



//window.onload = startScan;

// Xác định deviceIds của camera trước và sau (nếu có)
let frontCameraId = null;
let backCameraId = null;
let currentCameraId = null;

const videoElement = document.getElementById('video');
const switchCameraButton = document.getElementById('switchCamera');

// Khi trang được tải, lấy danh sách các thiết bị và khởi động camera mặc định
navigator.mediaDevices.enumerateDevices()
.then(devices => {
    devices.forEach(device => {
        if (device.kind === 'videoinput') {
            if (device.label.includes('front')) {
                frontCameraId = device.deviceId;
            } else if (device.label.includes('back')) {
                backCameraId = device.deviceId;
            }
        }
    });

    // Ưu tiên sử dụng camera sau nếu có thể
    currentCameraId = backCameraId ? backCameraId : frontCameraId;
    if (currentCameraId) {
        startCamera(currentCameraId);
    }
})
.catch(error => {
    console.error('Không thể lấy danh sách thiết bị: ', error);
});

function startCamera(deviceId) {
const constraints = {
    video: {deviceId: deviceId ? {exact: deviceId} : undefined}
};

// Dừng stream hiện thời nếu đang chạy
if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach(track => track.stop());
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        videoElement.srcObject = stream;
        scanQRCode();
    })
    .catch(error => {
        console.error("Không thể truy cập camera:", error);
    });
}

switchCameraButton.addEventListener('click', () => {
// Chuyển đổi giữa camera trước và sau
if (currentCameraId === frontCameraId && backCameraId) {
    currentCameraId = backCameraId;
} else if (currentCameraId === backCameraId && frontCameraId) {
    currentCameraId = frontCameraId;
}
startCamera(currentCameraId);
});
