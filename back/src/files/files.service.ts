import { Request } from 'express';
import { BadRequestException, Injectable } from '@nestjs/common';
import { unlink, readdir, stat, access } from 'fs/promises';
import { constants } from 'fs';
import * as path from 'path';
import { safeRename } from 'src/utils/utils';
import { Cron, CronExpression } from '@nestjs/schedule';
import { STORE_FILE_PATH, UPLOAD_FILE_PATH } from './utils';

@Injectable()
export class FilesService {
  constructor(
  ) { }

  async uploadImage(file: Express.Multer.File, req: Request) {
    // Здесь file содержит информацию о загруженном файле
    // Можно сохранить путь к файлу в базе данных
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('Файл не был загружен');
    }
    return {
      message: 'Image uploaded successfully',
      file_name: file.filename,
      full_file_name: file.path,
    };
  }

  async deleteImage(image: string | null | undefined) {
    if (!image || typeof image !== 'string' || image.trim() === '') {
      return; // Игнорируем пустые или невалидные значения
    }

    const delFile = path.join(STORE_FILE_PATH(), image);
    
    // Проверяем существование файла перед удалением
    try {
      await access(delFile, constants.F_OK);
      await unlink(delFile);
    } catch (err: any) {
      // Если файл не существует - это не ошибка, просто игнорируем
      if (err.code !== 'ENOENT') {
        console.warn(`Ошибка при удалении файла ${image}:`, err.message);
      }
    }

    // Также удаляем brief-версию, если она существует
    try {
      const fileExt = path.extname(image);
      const fileBaseName = path.basename(image, fileExt);
      const briefFileName = `${fileBaseName}brief${fileExt}`;
      const delBriefFile = path.join(STORE_FILE_PATH(), briefFileName);
      
      try {
        await access(delBriefFile, constants.F_OK);
        await unlink(delBriefFile);
      } catch (err: any) {
        // Если brief-файл не существует - это нормально
        if (err.code !== 'ENOENT') {
          console.warn(`Ошибка при удалении brief-файла ${briefFileName}:`, err.message);
        }
      }
    } catch (err: any) {
      console.warn(`Ошибка при обработке имени файла ${image}:`, err.message);
    }
  }

  async renameImage(newImage: string, prefix: string) {
    console.log('renameImage newImage=',newImage,'prefix=',prefix )
    const prefixedFileName = prefix + path.extname(newImage);
    const newFileName = path.join(UPLOAD_FILE_PATH(), newImage);
    const storedNewFileName = path.join(STORE_FILE_PATH(), prefixedFileName);
    await safeRename(newFileName, storedNewFileName);
    return prefixedFileName
  }

  async createRecordImage(image: string, prefix: string) {
    if (image) {
      return await this.updateRecordImage(
        null,
        image,
        prefix);
      
    }
    return null;
  }

  async updateRecordImage(oldImage: string | null, newImage: string | null, prefix: string) {
    console.log('updateRecordImage oldImage=',oldImage,'newImage=',newImage)
    let returnImage = '';
    if (newImage !== oldImage) { // мучать фото
      //console.log(`updateRecordImage`,oldImage,newImage,prefix);
      if (!newImage) {// удаление фото
        //console.log(`updateRecordImage delete`);
        await this.deleteImage(oldImage);
        returnImage = null;
      }
      else {
        if (!oldImage) {// назначение нового фото 
          returnImage = await this.renameImage(newImage, prefix);
        }
        else { // замена фото
          await this.deleteImage(oldImage);
          returnImage = await this.renameImage(newImage, prefix);
        }
      }
    }
    else
      returnImage = oldImage;

    return returnImage;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupOldFiles() {
    try {
      //console.log(`cleanupOldFiles`,UPLOAD_FILE_PATH,process.env.UPLOAD_FILE_PATH);
      const files = await readdir(UPLOAD_FILE_PATH());
      const now = Date.now();
      const olderThanMinutes = Number(process.env.MAX_UPLOADS_FILES_SAVE_MINUTES); 

      for (const file of files) {
        const filePath = path.join(UPLOAD_FILE_PATH(), file);
        const stats = await stat(filePath);
        const fileAgeInMinutes = (now - stats.mtime.getTime()) / (1000 * 60);

        if (fileAgeInMinutes > olderThanMinutes) {
          await unlink(filePath);
          console.log(`Удалён файл: ${filePath}`);
        }
      }
    } catch (err) {
      console.log(`Ошибка при удалении файлов: ${err.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldLogFiles() {
    try {
      const logDir = path.join(__dirname, '..', '..', 'logs');
      const files = await readdir(logDir);
      const now = Date.now();
      const olderThanDays = Number(process.env.MAX_LOG_FILES_SAVE_DAYS); 

      for (const file of files) {
        if (file.endsWith('.log') && file !== 'requests.log') {
          const filePath = path.join(logDir, file);
          const stats = await stat(filePath);
          const fileAgeInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

          if (fileAgeInDays > olderThanDays) {
            await unlink(filePath);
            console.log(`Удалён файл: ${filePath}`);
          }
        }
      }
    } catch (err) {
      console.log(`Ошибка при удалении файлов: ${err.message}`);
    }
  }

}
