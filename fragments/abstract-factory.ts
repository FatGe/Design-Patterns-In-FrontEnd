import { Cake } from "./simple-factory";

class Pack {
    private color: string;

    constructor(color: string) {
        this.color = color;
    }
}

abstract class Factory {
    public abstract produceCake(): Cake;
    public abstract producePack(): Pack;
}

class BirthdayCake extends Cake {
    private size: number;

    constructor(size: number = 4) {
        super("Choc");
        this.size = size;
    }
}

class BirthdayCakePack extends Pack {
    constructor() {
        super("red");
    }
}

class BirthdayCakeFactory extends Factory {
    public produceCake(): BirthdayCake {
        return new BirthdayCake();
    }
    public producePack(): BirthdayCakePack {
        return new BirthdayCakePack();
    }
}

const birthdayCakeFactory: BirthdayCakeFactory = new BirthdayCakeFactory();

console.log(birthdayCakeFactory.produceCake());
