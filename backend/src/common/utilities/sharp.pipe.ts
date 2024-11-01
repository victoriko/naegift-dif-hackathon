import { Injectable, PipeTransform } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class SharpPipe implements PipeTransform {
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    // console.log(JSON.stringify(image));
    if (image) {
      // Convert to thumbnail
      const newFileName = image.path.replace('file', 'thumbnail');
      const fileName = image.path;
      const buf = readFileSync(fileName);

      let idx = newFileName.lastIndexOf('/');
      if (idx === -1) {
        idx = newFileName.lastIndexOf('\\');
      }

      let idxThumb = newFileName.substring(0, idx).lastIndexOf('/');
      if (idxThumb === -1) {
        idxThumb = newFileName.substring(0, idx).lastIndexOf('\\');
      }

      const thumbPath = newFileName.substring(0, idxThumb);
      if (!existsSync(thumbPath)) {
        mkdirSync(thumbPath, { recursive: true });
      }

      const uploadPath = newFileName.substring(0, idx);
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      await sharp(buf).resize(100).toFile(newFileName);

      image['fileName'] = image.originalname;
      image['fileType'] = image.mimetype;
      image['filePath'] = image.path
        .replace(/^.*[\\\/]public[\\\/]/, '') // Remove up to /public and keep the remaining path
        .replace(/\\/g, '/');
      image['fileSize'] = image.size;
      // image['fileHash'] = orgFileHex;
      image['thumbnail'] = newFileName
        .replace(/^.*[\\\/]public[\\\/]/, '') // Remove up to /public and keep the remaining path
        .replace(/\\/g, '/');
      image['buf'] = buf;
    }
    // console.log(JSON.stringify(image));
    return image;
  }
}
