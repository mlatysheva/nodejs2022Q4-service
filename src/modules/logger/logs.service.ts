import { Injectable, LogLevel } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/createLog.dto';
import { EOL } from 'node:os';

@Injectable()
export class LogsService {
  private levels: LogLevel[];

  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = this.logsRepository.create(log);
    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });
    return newLog;

    // const newLog = `[NEST] ${new Date().toUTCString()} [Level: ${
    //   log.level
    // }] Context: ${log.context} Message: ${log.message}${EOL}`;
    // return newLog;
  }
}
