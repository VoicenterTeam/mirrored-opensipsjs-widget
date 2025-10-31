import StorageLogger, { ConfigOptions, LocalStorageWorker, LoggerDataPartial } from '@voicenter-team/socketio-storage-logger'
import packageInfo from '@/../package.json'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export class WebStorageLogger {
    private logger: StorageLogger | null = null

    constructor (options: ConfigOptions) {
        const config = { ...options }
        if (!config.loggerOptions.storageWorker) {
            config.loggerOptions.storageWorker = LocalStorageWorker
        }

        this.logger = new StorageLogger(config)


        this.setupStaticFields(config)
    }

    async setupStaticFields (config: ConfigOptions) {
        if (!config.loggerOptions.staticObject) {
            config.loggerOptions.staticObject = {}
        }

        const staticFields: LoggerDataPartial = {}

        staticFields.Version = packageInfo.version

        const fp = await FingerprintJS.load()
        const fingerprint = await fp.get()

        staticFields.Fingerprint = fingerprint.visitorId

        if (location.hostname) {
            staticFields.Host = location.hostname
        }

        this.logger?.setupStaticFields(staticFields)
    }

    log (data: object) {
        if (!this.logger) {
            throw new Error('Logger doesn\'t exist')
        }

        this.logger.log(data)
    }

    debug (data: object) {
        if (!this.logger) {
            throw new Error('Logger doesn\'t exist')
        }

        this.logger.debug(data)
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
