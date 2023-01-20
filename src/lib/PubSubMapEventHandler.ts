export class PubSubMapEventHandler<K, V> {
    private map: Map<K, V>;
    private listeners: Map<K, Array<(value: V | undefined) => void>> = new Map();

    public constructor(entries?: ConstructorParameters<typeof Map<K, V>>[0]) {
        this.map = new Map<K, V>(entries);
    }

    public get(key: K) {
        return this.map.get(key);
    }

    public has(key: K) {
        return this.map.has(key);
    }

    public on(key: K, callback: (value: V | undefined) => void) {
        if (this.listeners.has(key)) {
            this.listeners.set(key, [...this.listeners.get(key)!, callback]);
        } else {
            this.listeners.set(key, [callback]);
        }

        if (this.map.has(key)) {
            callback(this.map.get(key)!);
        }
    }

    public off(key: K, callback: (value: V | undefined) => void) {
        if (this.listeners.has(key)) {
            const temp = [...this.listeners.get(key)!];
            temp.splice(temp.indexOf(callback), 1);
            this.listeners.set(key, temp);
        }
    }

    public set(key: K, value: V) {
        this.map.set(key, value);
        if (this.listeners.has(key)) {
            for (const callback of this.listeners.get(key)!) {
                callback(this.map.get(key)!);
            }
        }
    }

    public delete(key: K) {
        this.map.delete(key)
        if (this.listeners.has(key)) {
            for (const callback of this.listeners.get(key)!) {
                callback(undefined);
            }
        }
    }
}
