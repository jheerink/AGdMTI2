document.getElementById('imageInput').addEventListener('change', function(e) {
    const imageUploadBox = document.getElementById('imageUploadBox');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();
    const imageInputLabel = document.getElementById('imageInputLabel');


    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        document.getElementById('imageInputLabel').style.display = 'none'; // Verbirgt das Label
        document.getElementById('imageInput').style.display = 'none'; // Verbirgt den Image Input, wenn gewünscht
        canvas.style.display = 'block'; // Zeigt das Canvas an
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});




document.getElementById('bwButton').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // rot
        data[i + 1] = avg; // grün
        data[i + 2] = avg; // blau
    }
    ctx.putImageData(imageData, 0, 0);
});




document.getElementById('downloadButton').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'bearbeitetes-bild.png';
    link.href = image;
    document.body.appendChild(link); // Füge den Link zum Body hinzu
    link.click();
    document.body.removeChild(link); // Entferne den Link wieder
});
