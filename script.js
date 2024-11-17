const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('downloadButton');
let image = new Image();

// Configura el tamaño del canvas
canvas.width = 400;
canvas.height = 400;

// Cargar la imagen
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Dibujar la imagen en el canvas
image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

// Recortar la imagen en diferentes formas
document.querySelectorAll('button[data-shape]').forEach(button => {
    button.addEventListener('click', () => {
        const shape = button.getAttribute('data-shape');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar la imagen en el canvas con recorte
        ctx.save();
        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
            ctx.clip();
        } else if (shape === 'square') {
            ctx.beginPath();
            ctx.rect(50, 50, canvas.width - 100, canvas.height - 100);
            ctx.clip();
        } else if (shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 50);
            ctx.lineTo(50, canvas.height - 50);
            ctx.lineTo(canvas.width - 50, canvas.height - 50);
            ctx.closePath();
            ctx.clip();
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    });
});

// Descargar la imagen recortada
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'imagen_recortada.png'; // Nombre del archivo
    link.href = canvas.toDataURL('image/png'); // Convierte el canvas en una URL de imagen
    link.click();
});

document.querySelectorAll('button[data-shape]').forEach(button => {
    button.addEventListener('click', () => {
        const shape = button.getAttribute('data-shape');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.beginPath();

        if (shape === 'circle') {
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        } else if (shape === 'square') {
            ctx.rect(50, 50, canvas.width - 100, canvas.height - 100);
        } else if (shape === 'triangle') {
            ctx.moveTo(canvas.width / 2, 50);
            ctx.lineTo(50, canvas.height - 50);
            ctx.lineTo(canvas.width - 50, canvas.height - 50);
            ctx.closePath();
        } else if (shape === 'pentagon') {
            drawPolygon(5);
        } else if (shape === 'star') {
            drawStar(5);
        } else if (shape === 'heart') {
            drawHeart();
        } else if (shape === 'hexagon') {
            drawPolygon(6);
        } else if (shape === 'octagon') {
            drawPolygon(8);
        } else if (shape === 'diamond') {
            drawDiamond();
        } else if (shape === 'oval') {
            drawOval();
        }

        ctx.clip();
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.restore();
    });
});

// Función para dibujar polígonos (pentágono, hexágono, octágono)
function drawPolygon(sides) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 50;
    const angleStep = (2 * Math.PI) / sides;

    for (let i = 0; i <= sides; i++) {
        const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// Función para dibujar una estrella
function drawStar(points) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = canvas.width / 2 - 50;
    const innerRadius = outerRadius / 2;
    const angleStep = Math.PI / points;

    for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// Función para dibujar un corazón
function drawHeart() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const topCurveHeight = 80;

    ctx.moveTo(centerX, centerY + 50);
    ctx.bezierCurveTo(
        centerX - 50, centerY - topCurveHeight, // Control point 1
        centerX - 100, centerY + 50,          // Control point 2
        centerX, centerY + 150               // End point
    );
    ctx.bezierCurveTo(
        centerX + 100, centerY + 50,
        centerX + 50, centerY - topCurveHeight,
        centerX, centerY + 50
    );
    ctx.closePath();
}

// Función para dibujar un rombo
function drawDiamond() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.moveTo(centerX, 50);
    ctx.lineTo(canvas.width - 50, centerY);
    ctx.lineTo(centerX, canvas.height - 50);
    ctx.lineTo(50, centerY);
    ctx.closePath();
}

// Función para dibujar un óvalo
function drawOval() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusX = canvas.width / 2 - 50;
    const radiusY = canvas.height / 2 - 100;

    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.closePath();
}

let isDragging = false; // Indica si se está arrastrando la imagen
let offsetX = 0; // Offset inicial en el eje X
let offsetY = 0; // Offset inicial en el eje Y
let startX; // Posición inicial del mouse en X
let startY; // Posición inicial del mouse en Y
let shape = ''; // Forma seleccionada para recorte

// Cargar la imagen
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
            offsetX = 0; // Reinicia el desplazamiento
            offsetY = 0;
        };
        reader.readAsDataURL(file);
    }
});

// Dibujar la imagen en el canvas con desplazamiento
function drawImageWithOffset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.drawImage(image, offsetX, offsetY, canvas.width, canvas.height);
    ctx.restore();
}

// Redibujar la imagen cuando se carga
image.onload = () => {
    drawImageWithOffset();
};

// Manejar eventos del mouse
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.offsetX - offsetX;
    startY = e.offsetY - offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.offsetX - startX;
        offsetY = e.offsetY - startY;
        drawImageWithOffset();  // Redibujar la imagen desplazada
        applyCrop(shape);  // Aplicar el recorte después de mover la imagen
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Manejar eventos táctiles (para dispositivos móviles)
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    startX = touch.clientX - rect.left - offsetX;
    startY = touch.clientY - rect.top - offsetY;
});

canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        offsetX = touch.clientX - rect.left - startX;
        offsetY = touch.clientY - rect.top - startY;
        drawImageWithOffset();
        applyCrop(shape);
    }
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
});

// Función para aplicar el recorte en base a la forma seleccionada
function applyCrop(shape) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();

    if (shape === 'circle') {
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    } else if (shape === 'square') {
        ctx.rect(50, 50, canvas.width - 100, canvas.height - 100);
    } else if (shape === 'triangle') {
        ctx.moveTo(canvas.width / 2, 50);
        ctx.lineTo(50, canvas.height - 50);
        ctx.lineTo(canvas.width - 50, canvas.height - 50);
        ctx.closePath();
    } else if (shape === 'pentagon') {
        drawPolygon(5);
    } else if (shape === 'star') {
        drawStar(5);
    } else if (shape === 'heart') {
        drawHeart();
    } else if (shape === 'hexagon') {
        drawPolygon(6);
    } else if (shape === 'octagon') {
        drawPolygon(8);
    } else if (shape === 'diamond') {
        drawDiamond();
    } else if (shape === 'oval') {
        drawOval();
    }

    ctx.clip();
    ctx.drawImage(image, offsetX, offsetY, canvas.width, canvas.height);
    ctx.restore();
}

// Función para dibujar polígonos (pentágono, hexágono, octágono)
function drawPolygon(sides) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 50;
    const angleStep = (2 * Math.PI) / sides;

    for (let i = 0; i <= sides; i++) {
        const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// Función para dibujar una estrella
function drawStar(points) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = canvas.width / 2 - 50;
    const innerRadius = outerRadius / 2;
    const angleStep = Math.PI / points;

    for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// Función para dibujar un corazón
function drawHeart() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const topCurveHeight = 80;

    ctx.moveTo(centerX, centerY + 50);
    ctx.bezierCurveTo(
        centerX - 50, centerY - topCurveHeight, // Control point 1
        centerX - 100, centerY + 50,          // Control point 2
        centerX, centerY + 150               // End point
    );
    ctx.bezierCurveTo(
        centerX + 100, centerY + 50,
        centerX + 50, centerY - topCurveHeight,
        centerX, centerY + 50
    );
    ctx.closePath();
}

// Función para dibujar un rombo
function drawDiamond() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.moveTo(centerX, 50);
    ctx.lineTo(canvas.width - 50, centerY);
    ctx.lineTo(centerX, canvas.height - 50);
    ctx.lineTo(50, centerY);
    ctx.closePath();
}

// Función para dibujar un óvalo
function drawOval() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusX = canvas.width / 2 - 50;
    const radiusY = canvas.height / 2 - 100;

    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.closePath();
}

// Cambiar forma de recorte
document.querySelectorAll('button[data-shape]').forEach(button => {
    button.addEventListener('click', () => {
        shape = button.getAttribute('data-shape');
        drawImageWithOffset();  // Redibujar la imagen con el nuevo recorte
        applyCrop(shape); // Aplicar el recorte con la forma seleccionada
    });
});

