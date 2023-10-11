export interface BroadcastChannelMessage<T> {
    transactionId: number
    data: T
}

export default class SyncBroadcastChannel {
    private channel: BroadcastChannel
    private nextTransactionId = 0
    private pendingTransactions: Map<number, (value: unknown) => void> = new Map()
    private callbacks: Array<(value: MessageEvent<BroadcastChannelMessage<unknown>>) => void> = []

    constructor (name: string) {
        this.channel = new BroadcastChannel(name)
        this.channel.addEventListener('message', this.onMessage.bind(this))
    }

    public onMessage<T> (event: MessageEvent<BroadcastChannelMessage<T>>) {
        const { transactionId, data } = event.data
        const resolve = this.pendingTransactions.get(transactionId)

        if (resolve) {
            resolve(data)
            this.pendingTransactions.delete(transactionId)
        }

        this.callbacks.forEach(callback => callback(event))
    }

    public addEventListener (callback: (event: MessageEvent<BroadcastChannelMessage<unknown>>) => void) {
        this.callbacks.push(callback)
    }

    async postMessage<T> (data: T, timeout = 5000): Promise<unknown> {
        const transactionId = this.nextTransactionId++
        let timer: ReturnType<typeof setTimeout>

        const promise = new Promise((resolve, reject) => {
            this.pendingTransactions.set(transactionId, resolve)
            timer = setTimeout(() => {
                this.pendingTransactions.delete(transactionId)
                reject(new Error(`Transaction ${transactionId} timed out`))
            }, timeout)
        })

        const message: BroadcastChannelMessage<T> = {
            transactionId,
            data,
        }

        this.channel.postMessage(message)

        return promise.then(
            (val) => {
                clearTimeout(timer)
                return val
            },
            (err) => {
                clearTimeout(timer)
                throw err
            }
        )
    }
}
