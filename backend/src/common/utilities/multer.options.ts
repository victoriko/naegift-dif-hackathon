import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import * as moment from 'moment-timezone';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { IMAGE_PATH } from '../constants/app.constant';

export const multerOptions = {
  fileFilter: (request, file, callback) => {
    const isMovie = request.originalUrl.startsWith('/video');

    const isImage =
      file.mimetype.match(/\/(jpg|jpeg|png|gif)$/) ||
      file.originalname.endsWith('.glb');
    const isVideo = file.mimetype.match(/\/(mp4)$/);

    if (!isMovie && isImage) {
      // Allow image formats: jpg, jpeg, png, gif, or glb extension
      callback(null, true);
    } else if (isMovie && isVideo) {
      // Allow video format: mp4 only
      callback(null, true);
    } else {
      callback(
        new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Unsupported image format.',
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (request, file, callback) => {
      let uploadPath = IMAGE_PATH
        ? join(IMAGE_PATH, 'public')
        : join(process.cwd(), 'public'); // Use current directory if IMAGE_PATH is null
      if (request.originalUrl.indexOf('/store') === 0) {
        uploadPath = join(uploadPath, 'store');
      } else if (request.originalUrl.indexOf('/gift') === 0) {
        uploadPath = join(uploadPath, 'gift');
      } else if (request.originalUrl.indexOf('/qna') === 0) {
        uploadPath = join(uploadPath, 'qna');
      }

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      uploadPath = join(uploadPath, 'file');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      uploadPath = join(uploadPath, moment().format('YYYYMMDD'));
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      callback(null, uploadPath);
    },
    filename: (request, file, callback) => {
      callback(null, `${Date.now()}${extname(file.originalname)}`);
    },
  }),
};
