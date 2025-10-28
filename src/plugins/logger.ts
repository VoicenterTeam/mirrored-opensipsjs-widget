import StorageLogger, { ConfigOptions, LocalStorageWorker } from '@voicenter-team/socketio-storage-logger'
import packageInfo from '@/../package.json'

export class WebStorageLogger {
    private readonly logger: StorageLogger

    constructor (options: ConfigOptions) {
        const config = { ...options }
        if (!config.loggerOptions.storageWorker) {
            config.loggerOptions.storageWorker = LocalStorageWorker
        }

        if (!config.loggerOptions.staticObject?.Version) {
            if (!config.loggerOptions.staticObject) {
                config.loggerOptions.staticObject = {}
            }

            config.loggerOptions.staticObject.Version = packageInfo.version
        }

        this.logger = new StorageLogger(config)
    }

    log (data: object) {
        if (!this.logger) {
            throw new Error('Logger doesn\'t exist')
        }

        this.logger.log(data)
    }

    error (data: object) {
        if (!this.logger) {
            throw new Error('Logger doesn\'t exist')
        }

        this.logger.error(data)
    }

    stop () {
        this.logger?.stop()
    }

    start () {
        this.logger?.start()
    }
}

let loggerInstance: WebStorageLogger | null = null

export function setLogger (config: ConfigOptions) {
    loggerInstance = new WebStorageLogger(config)
    return loggerInstance
}

export function getLogger () {
    return loggerInstance
}
