export class PubSubEventHandler<T> {
    private listeners: ((value: T) => void)[] = [];

    public constructor(
        private value: T
    ) {
    }

    public get() {
        return this.value;
    }

    public on(callback: (value: T) => void) {
        this.listeners.push(callback);
        callback(this.value);
    }

    public off(callback: (value: T) => void) {
        this.listeners.splice(this.listeners.indexOf(callback), 1);
    }

    public update(value: T) {
        this.value = value;
        for (const callback of this.listeners) {
            callback(this.value);
        }
    }
}
