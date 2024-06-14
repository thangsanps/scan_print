// Hàm gửi dữ liệu đến webhook
function sendDataToWebhook(qrCodeMessage) {
    const webhookUrl = document.getElementById('webhookUrl').value + "?data=" + qrCodeMessage;
   if (isValidUrl(webhookUrl)) {
       fetch(webhookUrl, {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({ data: qrCodeMessage })
       })
       .then(response => response.json())
       .then(data => {
           console.log('Success:', data);
       })
       .catch((error) => {
           console.error('Error:', error);
       });
   }
}