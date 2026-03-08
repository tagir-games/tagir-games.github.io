// Импорт необходимых библиотек
const { createWorker } = require('worker-loader');
const { GIF } = require('gif.js');

// Создание рабочего процесса для преобразования изображений
const worker = createWorker({
  // путь к файлу worker.js
  workerPath: './worker.js',
});

// Создание объекта для преобразования изображений в GIF
const gif = new GIF({
  // количество кадров в секунду
  repeat: 0,
  // задержка между кадрами в миллисекундах
  delay: 100,
});

// функция для добавления кадров в GIF
function addFrame(image) {
  // создание объекта для представления кадра
  const frame = {
    // изображение кадра
    image,
    // задержка перед следующим кадром
    delay: 100,
  };
  // добавление кадра в GIF
  gif.addFrame(frame);
}

// функция для преобразования изображений в GIF
async function convertImagesToGif(images) {
  // создание массива для хранения кадров
  const frames = [];

  // итерация по изображениям
  for (const image of images) {
    // чтение изображения
    const img = await readImage(image);
    // добавление кадра в GIF
    addFrame(img);
  }

  // рендеринг GIF
  const gifBlob = await gif.getBlob();
  // сохранение GIF в файл
  saveBlobAsFile(gifBlob, 'output.gif');
}

// функция для чтения изображения
async function readImage(image) {
  // создание объекта для чтения изображения
  const img = new Image();
  // установка источника изображения
  img.src = URL.createObjectURL(image);
  // ожидание загрузки изображения
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  // возврат изображения
  return img;
}

// функция для сохранения блоба в файл
function saveBlobAsFile(blob, filename) {
  // создание ссылки на.blob
  const url = URL.createObjectURL(blob);
  // создание элемента <a> для скачивания файла
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  // клик на элемент <a> для скачивания файла
  a.click();
  // отмена ссылки на.blob
  URL.revokeObjectURL(url);
}

// пример использования
const images = [
  // массив файлов изображений
  new File([''], 'image1.png', { type: 'image/png' }),
  new File([''], 'image2.png', { type: 'image/png' }),
  new File([''], 'image3.png', { type: 'image/png' }),
];

convertImagesToGif(images);
