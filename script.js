function onScanSuccess(qrCodeMessage) {
    document.getElementById("result").innerHTML = qrCodeMessage;
    printQRCode(qrCodeMessage); // Gọi hàm in sau khi quét thành công
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

function printQRCode(qrCodeMessage) {

var dataToPrint = "Nội dung in"; // Nội dung bạn muốn in

// Gửi dữ liệu in đến máy in Xprinter 350B bằng thư viện "qz-tray"
qz.websocket.connect().then(() => {
return qz.printers.find("Microsoft Print to PDF");
}).then((found) => {
var config = qz.configs.create(found);
var data = [ {
    type: 'pixel',
    format: 'html',
    flavor: 'plain',
    data: '<H1>hello world</H1>'
}];

return qz.print(config, data);
}).catch((e) => {
alert(e);
}).finally(() => {
return qz.websocket.disconnect();
});

}
window.onload = startScan;