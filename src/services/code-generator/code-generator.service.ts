import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CodeGeneratorService {
  async generateUniqueCode(count: number = 6): Promise<string> {
    const randomData = Math.random().toString() + Date.now().toString();
    const hash = crypto.createHash('sha256').update(randomData).digest('hex');
    const code = parseInt(hash, 16) % 1000000;
    return code.toString().padStart(count, '0');
  }
}
