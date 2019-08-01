export class Cake {
    protected material: string = "chocolate";

    constructor(material: string) {
        this.material = material;
    }

    public getMaterial() {
        return this.material;
    }
}

export class ChocCake extends Cake {
    private size: number;

    constructor(size) {
        super("chocolate");
        this.size = size;
    }

    public getSize() {
        return this.size;
    }
}

export class IcecreamCake extends Cake {
    private size: number;
    private flavor: string;

    constructor(size, flavor) {
        super("icecream");
        this.size = size;
        this.flavor = flavor;
    }

    public getSize() {
        return this.size;
    }
}

class CakeFactory {
    protected static cache: Map<string, Cake> = new Map();
    public static CakeFactory(cakeType: string): Cake {
        const size: number = 8;
        let cake: Cake = this.cache.get(cakeType)

        if (cake) return cake
        switch (cakeType) {
            case "choc": {
                cake = new ChocCake(size);
            }
            case "icecream": {
                const flavor: string = "vanilla";
                cake = new IcecreamCake(size, flavor);
            }
        }

        this.cache.set(cakeType, cake);
        return cake;
    }
}

console.log(CakeFactory.CakeFactory("icecream"));
