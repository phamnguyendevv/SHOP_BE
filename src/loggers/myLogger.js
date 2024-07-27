import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
                return `${timestamp} :: ${level} :: ${context} ::  ${requestId} :: ${message} :: ${metadata ? JSON.stringify(metadata) : ''}`;
            }
        );

        this.logger = createLogger({
            format: format.combine(
                format.timestamp(),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'error'
                })
            ]
        });
    }

    commonParams(params) {
        let context, req, metadata;
        if (!Array.isArray(params)) {
            context = params;
        } else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || 'unknown';
        return { context, requestId, metadata };
    }

    log(message, params) {
        const paramsLog = this.commonParams(params);
        const logObject = Object.assign({ message }, paramsLog);
        this.logger.info(logObject);
    }

    error(message, params) {
        console.log('error', message, params)
        const paramsLog = this.commonParams(params);
        const logObject = Object.assign({ message }, paramsLog);
        this.logger.error(logObject);
    }
}

export default MyLogger;
