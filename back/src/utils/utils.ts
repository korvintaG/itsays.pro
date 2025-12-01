import {
  BadRequestException,
} from '@nestjs/common';
import { IUser, SimpleEntity, Role } from '../types/custom';
import * as fs from 'fs/promises';
import * as path from 'path';
import { STORE_FILE_PATH } from '../files/utils';

// Для работы функции createBriefImage необходимо установить библиотеку sharp:
// npm install sharp
let sharpModule: any = null;
try {
  const sharpRequire = require('sharp');
  // sharp может экспортироваться по-разному в зависимости от версии
  sharpModule = sharpRequire?.default || sharpRequire;
  
  // Проверяем, что это функция
  if (typeof sharpModule !== 'function') {
    sharpModule = null;
    console.warn('Библиотека sharp не может быть использована: экспорт не является функцией');
  }
} catch (err) {
  console.warn('Библиотека sharp не установлена. Функция createBriefImage будет недоступна.');
  console.warn('Для установки выполните: npm install sharp');
}

export function joinSimpleEntityFirst(
  relations: SimpleEntity[],
  max: number = 4,
): string {
  let errMessage = '';
  for (let i in relations) {
    if (Number(i) >= max) errMessage = errMessage + ' ...';
    else
      errMessage =
        errMessage +
        ' [' +
        relations[i].name +
        ' (id=' +
        relations[i].id +
        ')]';
  }
  return errMessage;
}

export function trimSlashesAndPoints(str: string): string {
  let res = str.replaceAll('/', '');
  res = res.replaceAll('\\', '');
  res = res.replaceAll('.', '');
  return res;
}

export async function safeRename(oldPath: string, newPath: string) {
  //console.log('safeRename oldPath', oldPath, 'newPath', newPath);
  const dir = path.dirname(newPath);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.rename(oldPath, newPath);
    // Извлекаем только имя файла из полного пути
    const fileName = path.basename(newPath);
    // Пытаемся создать brief-изображение, но не прерываем процесс при ошибке
    try {
      await createBriefImage(fileName);
    } catch (briefError: any) {
      // Логируем ошибку, но не прерываем процесс - brief-изображение не критично
      const errorMessage = briefError?.message || briefError?.toString() || 'Unknown error';
      console.warn(`Не удалось создать brief-изображение для ${fileName}:`, errorMessage);
      // Не пробрасываем ошибку дальше - brief-изображение не критично для работы
    }
    //console.log('Файл успешно перемещён!');
  } catch (err) {
    //console.error('Ошибка перемещения файла:', err);
    throw new BadRequestException(
      {
        error: 'Bad Request',
        message: `Ошибка перемещения файла ${oldPath} в ${newPath}: ${err.message}`
      }
    );
  }
}

export async function getFileCreateDate(filePath: string): Promise<string> {
  try {
    const stats = await fs.stat(filePath);
    const fileDate = stats.mtime.toDateString();
    return fileDate;
  } catch (err) {
    return null;
  }
}

export function formatDateForFilename(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`
}

/**
 * Создает сжатую версию изображения низкого качества (50-100 КБ)
 * @param fileName - имя файла (например, "photo.jpg")
 * @returns имя созданного файла с добавлением 'brief' перед расширением (например, "photobrief.jpg")
 */
export async function createBriefImage(fileName: string): Promise<string> {
  console.log('[createBriefImage] START - входной параметр fileName:', fileName);
  console.log('[createBriefImage] Тип fileName:', typeof fileName);
  
  // Проверяем, установлена ли библиотека sharp
  console.log('[createBriefImage] Проверка sharpModule:', {
    exists: !!sharpModule,
    type: typeof sharpModule,
    isFunction: typeof sharpModule === 'function'
  });
  
  if (!sharpModule) {
    const error = 'Библиотека sharp не установлена. Установите: npm install sharp';
    console.error('[createBriefImage] ERROR - sharpModule не установлен');
    throw new Error(error);
  }
  
  // Дополнительная проверка, что sharpModule является функцией
  try {
    if (typeof sharpModule !== 'function') {
      const error = 'Библиотека sharp не может быть использована: экспорт не является функцией';
      console.error('[createBriefImage] ERROR - sharpModule не является функцией');
      throw new Error(error);
    }
    console.log('[createBriefImage] sharpModule проверен успешно');
  } catch (err: any) {
    console.error('[createBriefImage] ERROR при проверке sharp:', err);
    throw new Error(`Ошибка проверки sharp: ${err?.message || err}`);
  }
  
  // Проверяем существование исходного файла
  const storePath = STORE_FILE_PATH();
  console.log('[createBriefImage] STORE_FILE_PATH:', storePath);
  
  const sourcePath = path.join(storePath, fileName);
  console.log('[createBriefImage] Путь к исходному файлу:', sourcePath);
  
  try {
    await fs.access(sourcePath);
    console.log('[createBriefImage] Исходный файл существует');
  } catch (err: any) {
    console.error('[createBriefImage] ERROR - исходный файл не найден:', {
      fileName,
      sourcePath,
      error: err?.message || err,
      code: err?.code
    });
    throw new Error(`Исходный файл не найден: ${fileName}`);
  }

  // Формируем имя нового файла: добавляем 'brief' перед расширением
  const fileExt = path.extname(fileName); // .jpg
  const fileBaseName = path.basename(fileName, fileExt); // photo
  const briefFileName = `${fileBaseName}brief${fileExt}`; // photobrief.jpg
  const outputPath = path.join(storePath, briefFileName);
  
  console.log('[createBriefImage] Имена файлов:', {
    fileExt,
    fileBaseName,
    briefFileName,
    outputPath
  });

  // Целевые размеры файла
  const MIN_SIZE = 50 * 1024; // 50 KB
  const MAX_SIZE = 100 * 1024; // 100 KB
  console.log('[createBriefImage] Целевые размеры файла:', {
    MIN_SIZE: `${MIN_SIZE} bytes (${MIN_SIZE / 1024} KB)`,
    MAX_SIZE: `${MAX_SIZE} bytes (${MAX_SIZE / 1024} KB)`
  });

  // Проверяем размер исходного файла
  let sourceFileSize: number;
  try {
    const sourceStats = await fs.stat(sourcePath);
    sourceFileSize = sourceStats.size;
    console.log('[createBriefImage] Размер исходного файла:', {
      bytes: sourceFileSize,
      KB: (sourceFileSize / 1024).toFixed(2),
      isLessThanMax: sourceFileSize < MAX_SIZE
    });
  } catch (err: any) {
    console.error('[createBriefImage] ERROR при получении размера файла:', {
      error: err?.message || err,
      code: err?.code
    });
    throw new Error(`Ошибка получения размера файла: ${err?.message || err}`);
  }

  // Если исходный файл уже меньше 100 КБ, применяем ориентацию и копируем
  if (sourceFileSize < MAX_SIZE) {
    console.log('[createBriefImage] Исходный файл уже меньше 100 КБ, применяем ориентацию и копируем');
    try {
      // Читаем метаданные для получения ориентации
      const sharpInstanceForCopy = sharpModule(sourcePath);
      const copyMetadata = await sharpInstanceForCopy.metadata();
      
      console.log('[createBriefImage] Метаданные для копирования:', {
        orientation: copyMetadata?.orientation,
        width: copyMetadata?.width,
        height: copyMetadata?.height
      });
      
      // Применяем ориентацию и сохраняем (autoOrient автоматически поворачивает изображение)
      // Устанавливаем orientation: 1 (нормальная ориентация) после применения поворота
      let outputBuffer: Buffer;
      
      // Определяем формат выходного файла (сохраняем в том же формате, что и исходный)
      const sourceFormat = copyMetadata?.format || 'jpeg';
      
      if (sourceFormat === 'jpeg' || sourceFormat === 'jpg') {
        outputBuffer = await sharpInstanceForCopy
          .autoOrient() // Автоматически применяет EXIF ориентацию и поворачивает изображение
          .jpeg({ quality: 85 }) // Сохраняем как JPEG
          .withMetadata({ orientation: 1 }) // Устанавливаем нормальную ориентацию в метаданных
          .toBuffer();
      } else if (sourceFormat === 'png') {
        outputBuffer = await sharpInstanceForCopy
          .autoOrient() // Автоматически применяет EXIF ориентацию и поворачивает изображение
          .png() // Сохраняем как PNG
          .withMetadata({ orientation: 1 }) // Устанавливаем нормальную ориентацию в метаданных
          .toBuffer();
      } else {
        // Для других форматов конвертируем в JPEG
        outputBuffer = await sharpInstanceForCopy
          .autoOrient() // Автоматически применяет EXIF ориентацию и поворачивает изображение
          .jpeg({ quality: 85 }) // Сохраняем как JPEG
          .withMetadata({ orientation: 1 }) // Устанавливаем нормальную ориентацию в метаданных
          .toBuffer();
      }
      
      await fs.writeFile(outputPath, outputBuffer);
      console.log('[createBriefImage] SUCCESS - файл скопирован с учетом ориентации:', briefFileName);
      return briefFileName;
    } catch (copyError: any) {
      console.error('[createBriefImage] ERROR при копировании файла:', {
        sourcePath,
        outputPath,
        error: copyError?.message || copyError,
        stack: copyError?.stack,
        code: copyError?.code
      });
      throw new Error(`Ошибка копирования файла: ${copyError?.message || copyError}`);
    }
  }

  console.log('[createBriefImage] Исходный файл больше 100 КБ, начинаем сжатие');

  // Читаем метаданные исходного изображения
  let metadata: any;
  try {
    console.log('[createBriefImage] Создание экземпляра sharp для чтения метаданных...');
    console.log('[createBriefImage] Вызов sharpModule с параметром:', sourcePath);
    
    const sharpInstance = sharpModule(sourcePath);
    console.log('[createBriefImage] Экземпляр sharp создан:', {
      exists: !!sharpInstance,
      type: typeof sharpInstance,
      hasMetadata: typeof sharpInstance?.metadata === 'function'
    });
    
    if (!sharpInstance || typeof sharpInstance.metadata !== 'function') {
      const error = 'Не удалось создать экземпляр sharp';
      console.error('[createBriefImage] ERROR - некорректный экземпляр sharp:', {
        sharpInstance,
        hasMetadata: typeof sharpInstance?.metadata
      });
      throw new Error(error);
    }
    
    console.log('[createBriefImage] Чтение метаданных...');
    metadata = await sharpInstance.metadata();
    console.log('[createBriefImage] Метаданные получены:', {
      width: metadata?.width,
      height: metadata?.height,
      format: metadata?.format,
      size: metadata?.size,
      hasAlpha: metadata?.hasAlpha,
      hasProfile: metadata?.hasProfile,
      orientation: metadata?.orientation
    });
  } catch (err: any) {
    console.error('[createBriefImage] ERROR при чтении метаданных:', {
      error: err?.message || err,
      stack: err?.stack,
      name: err?.name,
      code: err?.code
    });
    throw new Error(`Ошибка чтения метаданных изображения: ${err?.message || err}`);
  }
  
  // Определяем правильные размеры с учетом ориентации
  // Если ориентация требует поворота на 90/270 градусов, ширина и высота меняются местами
  let imageWidth = metadata.width || 800;
  let imageHeight = metadata.height || 800;
  const orientation = metadata.orientation || 1;
  
  // Ориентации 5, 6, 7, 8 требуют поворота (90 или 270 градусов)
  // В этом случае ширина и высота меняются местами для расчета
  if (orientation >= 5 && orientation <= 8) {
    // Меняем местами для правильного расчета aspectRatio
    const temp = imageWidth;
    imageWidth = imageHeight;
    imageHeight = temp;
  }
  
  // Начальные параметры для сжатия
  const aspectRatio = imageWidth / imageHeight;
  let currentWidth = Math.min(imageWidth, 800);
  let currentHeight = Math.round(currentWidth / aspectRatio);
  let quality = 75;

  console.log('[createBriefImage] Начальные параметры сжатия:', {
    aspectRatio: aspectRatio.toFixed(3),
    currentWidth,
    currentHeight,
    quality,
    originalWidth: metadata.width,
    originalHeight: metadata.height
  });

  // Итеративно сжимаем изображение до целевого размера
  let outputBuffer: Buffer | null = null;
  let attempts = 0;
  const maxAttempts = 15;

  console.log('[createBriefImage] Начало цикла сжатия (maxAttempts:', maxAttempts, ')');

  while (attempts < maxAttempts) {
    console.log(`[createBriefImage] Попытка ${attempts + 1}/${maxAttempts}:`, {
      currentWidth,
      currentHeight,
      quality
    });
    
    try {
      // Создаем новый экземпляр sharp для каждой итерации
      console.log(`[createBriefImage] Попытка ${attempts + 1}: Создание экземпляра sharp...`);
      const sharpInstance = sharpModule(sourcePath);
      
      if (!sharpInstance) {
        console.error(`[createBriefImage] Попытка ${attempts + 1}: ERROR - sharpInstance равен null или undefined`);
        throw new Error('Не удалось создать экземпляр sharp');
      }
      
      console.log(`[createBriefImage] Попытка ${attempts + 1}: Экземпляр sharp создан, начало обработки изображения...`);
      
      outputBuffer = await sharpInstance
        .autoOrient() // Автоматически применяет EXIF ориентацию и поворачивает изображение
        .resize(currentWidth, currentHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: quality,
          mozjpeg: true // Используем mozjpeg для лучшего сжатия
        })
        .withMetadata({ orientation: 1 }) // Устанавливаем нормальную ориентацию в метаданных после поворота
        .toBuffer();
      
      console.log(`[createBriefImage] Попытка ${attempts + 1}: Изображение обработано, размер буфера:`, outputBuffer?.length || 0);
    } catch (sharpError: any) {
      console.error(`[createBriefImage] Попытка ${attempts + 1}: ERROR при обработке изображения:`, {
        error: sharpError?.message || sharpError,
        stack: sharpError?.stack,
        name: sharpError?.name,
        code: sharpError?.code
      });
      throw new Error(`Ошибка обработки изображения: ${sharpError?.message || sharpError}`);
    }

    const fileSize = outputBuffer.length;
    const fileSizeKB = (fileSize / 1024).toFixed(2);
    
    console.log(`[createBriefImage] Попытка ${attempts + 1}: Размер файла:`, {
      bytes: fileSize,
      KB: fileSizeKB,
      targetMin: `${MIN_SIZE} bytes (${MIN_SIZE / 1024} KB)`,
      targetMax: `${MAX_SIZE} bytes (${MAX_SIZE / 1024} KB)`,
      isInRange: fileSize >= MIN_SIZE && fileSize <= MAX_SIZE
    });
    
    // Если размер подходит (между 50 и 100 КБ), останавливаемся
    if (fileSize >= MIN_SIZE && fileSize <= MAX_SIZE) {
      console.log(`[createBriefImage] Попытка ${attempts + 1}: Размер подходит! Останавливаем сжатие.`);
      break;
    }

    // Если файл слишком большой
    if (fileSize > MAX_SIZE) {
      console.log(`[createBriefImage] Попытка ${attempts + 1}: Файл слишком большой, уменьшаем...`);
      if (quality > 40) {
        // Сначала снижаем качество
        const oldQuality = quality;
        quality -= 10;
        console.log(`[createBriefImage] Попытка ${attempts + 1}: Снижаем качество: ${oldQuality} -> ${quality}`);
      } else if (currentWidth > 400 || currentHeight > 400) {
        // Затем уменьшаем разрешение
        const oldWidth = currentWidth;
        const oldHeight = currentHeight;
        currentWidth = Math.round(currentWidth * 0.85);
        currentHeight = Math.round(currentWidth / aspectRatio);
        quality = 60; // Возвращаем качество
        console.log(`[createBriefImage] Попытка ${attempts + 1}: Уменьшаем разрешение: ${oldWidth}x${oldHeight} -> ${currentWidth}x${currentHeight}, quality: ${quality}`);
      } else {
        // Если уже минимальные размеры - используем то, что есть
        console.log(`[createBriefImage] Попытка ${attempts + 1}: Достигнуты минимальные размеры, используем текущий результат`);
        break;
      }
    } else {
      // Если файл слишком маленький - можем увеличить качество
      console.log(`[createBriefImage] Попытка ${attempts + 1}: Файл слишком маленький, увеличиваем качество...`);
      if (quality < 90 && fileSize < MIN_SIZE) {
        const oldQuality = quality;
        quality += 5;
        console.log(`[createBriefImage] Попытка ${attempts + 1}: Увеличиваем качество: ${oldQuality} -> ${quality}`);
      } else {
        console.log(`[createBriefImage] Попытка ${attempts + 1}: Не можем увеличить качество дальше, используем текущий результат`);
        break;
      }
    }

    attempts++;
  }

  if (!outputBuffer) {
    console.error('[createBriefImage] ERROR - outputBuffer равен null после всех попыток');
    throw new BadRequestException('Не удалось создать сжатое изображение');
  }

  console.log('[createBriefImage] Цикл сжатия завершен:', {
    attempts,
    finalSize: outputBuffer.length,
    finalSizeKB: (outputBuffer.length / 1024).toFixed(2),
    finalWidth: currentWidth,
    finalHeight: currentHeight,
    finalQuality: quality
  });

  // Сохраняем сжатое изображение
  console.log('[createBriefImage] Сохранение файла:', outputPath);
  try {
    await fs.writeFile(outputPath, outputBuffer);
    console.log('[createBriefImage] Файл успешно сохранен:', briefFileName);
  } catch (writeError: any) {
    console.error('[createBriefImage] ERROR при сохранении файла:', {
      outputPath,
      error: writeError?.message || writeError,
      stack: writeError?.stack,
      code: writeError?.code
    });
    throw new Error(`Ошибка сохранения файла: ${writeError?.message || writeError}`);
  }

  console.log('[createBriefImage] SUCCESS - возвращаем имя файла:', briefFileName);
  return briefFileName;
}