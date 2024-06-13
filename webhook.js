

// Hàm gửi dữ liệu đến webhook
function sendDataToWebhook(qrCodeMessage) {
    fetch('https://webhook.site/6ea867d1-c106-4423-a609-5e4db9d264bc', {
        method: 'POST', // Phương thức gửi dữ liệu
        headers: {
            'Content-Type': 'application/json', // Định rõ loại nội dung đang được gửi
        },
        body: JSON.stringify({
            qrData: qrCodeMessage
            
            // Dữ liệu bạn muốn gửi
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}