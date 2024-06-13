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