import {isDevEnv} from "./util";
import {IComponentMap} from "../lib/IComponentMap";
import {runtimeError} from "./error";

type RegistryEntry = Partial<{
    [componentName in keyof IComponentMap]: InstanceType<IComponentMap[ componentName ]>;
}>;

export class EntityRegistry {
    private registry: { [uuid: string]: RegistryEntry; } = {};

    public constructor() {
        if (isDevEnv()) {
            (window as any).displayRegistry = () => {
                console.table(this.registry);
            };
        }
    }

    public create(): string {
        const uuid = crypto.randomUUID();
        this.registry[uuid] = {};
        return uuid;
    }

    public attach<K extends keyof IComponentMap>(
        uuid: string, componentName: K, data: InstanceType<IComponentMap[ K ]>
    ) {
        if (!this.isInRegistry(uuid)) {
            runtimeError("EntityRegistry", "Attempted to attach component to an entity that does not exist");
        }

        // one of typescript's bullshit
        (this.registry[uuid][componentName] as any) = data;
    }

    public detach<K extends keyof IComponentMap>(uuid: string, componentName: K) {
        if (!this.isInRegistry(uuid)) {
            runtimeError("EntityRegistry", "Attempted to detach component from an entity that does not exist");
        }

        delete this.registry[uuid][componentName];
    }

    public destroy(uuid: string) {
        if (!this.isInRegistry(uuid)) {
            runtimeError("EntityRegistry", "Attempted to destroy an entity that does not exist");
        }

        delete this.registry[uuid];
    }

    public view<K extends (keyof IComponentMap)[]>(...components: K) {
        return new RegistryView(this.registry, ...components);
    }

    private isInRegistry(entityUUID: string): boolean {
        return !!this.registry[entityUUID];
    }
}


export class RegistryView<K extends (keyof IComponentMap)[]> {
    private components: K;

    public constructor(
        private registry: { [uuid: string]: RegistryEntry; },
        ...components: K
    ) {
        this.components = components;
    }

    * [Symbol.iterator]() {
        for (const uuid of Object.keys(this.registry)) {
            const entity = this.registry[uuid];

            if (this.components.every((v) => !!entity[v])) {
                const entityCompObj: {
                    [key in K[ number ]]: InstanceType<IComponentMap[ key ]>
                } = {} as any;
                const neededComps = Object.keys(entity).filter((c) => {
                    return this.components.includes(c as keyof IComponentMap);
                });

                for (const compKey of neededComps) {
                    (entityCompObj as any)[compKey] = entity[compKey as keyof IComponentMap];
                }

                yield {uuid: uuid, ...entityCompObj};
            }
        }
    }
}
