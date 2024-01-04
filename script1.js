//Hauptfunktionen
//Bild hochladen, Button verschwindet wenn Bild hochgeladen---------------------------

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

	saveOriginalImage();

        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});


//download Button-------------------------------------------


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


//Original wiederherstellen------------------------------


let originalImageData = null;

function saveOriginalImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreOriginalImage() {
    if (originalImageData) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.putImageData(originalImageData, 0, 0);
    }
}

document.getElementById('restoreOriginalButton').addEventListener('click', restoreOriginalImage);






//Bildbearbeitungsfunktionen
//Grauwert------------------------------


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


//Schwarzweißregler-----
document.getElementById('thresholdSlider').addEventListener('input', function() {
    applyThreshold(this.value);
});

function applyThreshold(threshold) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const binaryColor = brightness < threshold ? 0 : 255;
        data[i] = binaryColor;     // Rot
        data[i + 1] = binaryColor; // Grün
        data[i + 2] = binaryColor; // Blau
    }

    ctx.putImageData(imageData, 0, 0);
}


//Helligkeit--------------------------------

// Funktion zum Anpassen der Helligkeit
function adjustBrightness(factor) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] += 255 * (factor - 1);     // Rot
        data[i + 1] += 255 * (factor - 1); // Grün
        data[i + 2] += 255 * (factor - 1); // Blau
        // Alpha (data[i + 3]) bleibt unverändert
    }

    ctx.putImageData(imageData, 0, 0);
}


// Event Listener für den Aufhellen-Knopf
document.getElementById('brightenButton').addEventListener('click', function() {
    adjustBrightness(1.1); // Helligkeit um 10% erhöhen
});

// Event Listener für den Abdunkeln-Knopf
document.getElementById('darkenButton').addEventListener('click', function() {
    adjustBrightness(0.9); // Helligkeit um 10% verringern
});



//negativieren--------------------------- Farbwerte jedes pixels umkehren mit 255- aktuelle Zahl = neue--

function makeNegative() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];       // Rot
        data[i + 1] = 255 - data[i + 1]; // Grün
        data[i + 2] = 255 - data[i + 2]; // Blau
        // Der Alpha-Wert bleibt unverändert
    }

    ctx.putImageData(imageData, 0, 0);
}


//dynamisch rgbanteile ändern------------------------------

function updateColorComponent(component, value) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i + component] = value; // Aktualisiere den spezifischen Farbanteil
    }

    ctx.putImageData(imageData, 0, 0);
}

// Event Listener für die Schieberegler
document.getElementById('redSlider').addEventListener('input', function() {
    updateColorComponent(0, this.value); // 0 steht für den Rotanteil im imageData.data Array
});

document.getElementById('greenSlider').addEventListener('input', function() {
    updateColorComponent(1, this.value); // 1 steht für den Grünanteil
});

document.getElementById('blueSlider').addEventListener('input', function() {
    updateColorComponent(2, this.value); // 2 steht für den Blauanteil
});


//rotation-------------------------------

let rotation = 0; // Aktuelle Drehung des Bildes

function rotateImage(direction) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    rotation += direction === 'cw' ? 90 : -90;
    rotation = rotation % 360; // Halte den Wert zwischen 0 und 359 Grad

    // Erstelle ein neues temporäres Canvas, um das Bild zwischenzuspeichern
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Zeichne das ursprüngliche Bild auf das temporäre Canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Berechne die neue Canvas-Größe und positioniere das Bild
    let newWidth, newHeight;
    if (rotation % 180 === 0) {
        newWidth = tempCanvas.width;
        newHeight = tempCanvas.height;
    } else {
        newWidth = tempCanvas.height;
        newHeight = tempCanvas.width;
    }

    // Setze die neue Größe des Original-Canvas und richte das Bild aus
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.clearRect(0, 0, newWidth, newHeight);
    ctx.save();

    // Richtige Positionierung basierend auf der aktuellen Drehung
    if (rotation === 90 || rotation === -270) {
        ctx.translate(newWidth, 0);
    } else if (rotation === 180 || rotation === -180) {
        ctx.translate(newWidth, newHeight);
    } else if (rotation === 270 || rotation === -90) {
        ctx.translate(0, newHeight);
    }
    ctx.rotate(rotation * Math.PI / 180);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
}

document.getElementById('rotateCwButton').addEventListener('click', function() {
    rotateImage('cw');
});

document.getElementById('rotateCcwButton').addEventListener('click', function() {
    rotateImage('ccw');
});




//spiegeln-------------------

function mirrorImage(horizontal) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Kopiere das ursprüngliche Bild in ein temporäres Canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Klare das ursprüngliche Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spiegelung anwenden
    ctx.save();
    if (horizontal) {
        ctx.scale(1, -1); // Horizontal spiegeln (entlang der Y-Achse)
        ctx.drawImage(tempCanvas, 0, -canvas.height);
    } else {
        ctx.scale(-1, 1); // Vertikal spiegeln (entlang der X-Achse)
        ctx.drawImage(tempCanvas, -canvas.width, 0);
    }
    ctx.restore(); // Wiederherstellung des ursprünglichen Zustands des Kontextes
}

document.getElementById('horizontalMirrorButton').addEventListener('click', function() {
    mirrorImage(true);
});

document.getElementById('verticalMirrorButton').addEventListener('click', function() {
    mirrorImage(false);
});



