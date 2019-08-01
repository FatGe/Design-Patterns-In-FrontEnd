import { Cake, ChocCake, IcecreamCake } from "./simple-factory";

export abstract class Factory {
    // Factory method
    public abstract produce(): Cake;
}

class ChocCakeFactory extends Factory {

    public produce(): ChocCake {
        return new ChocCake(4);
    }
}

class IcecreamFactory extends Factory {

    public produce(): IcecreamCake {
        return new IcecreamCake(8, "vanilla");
    }
}

console.log(new ChocCakeFactory().produce());

class SubCake extends Cake {
    public static pruduceFromChocFactory(size: number): SubCake {
        return new SubCake("choc", size);
    }
    public static pruduceFromIcecreamFactory(size: number): SubCake {
        return new SubCake("icecream", size);
    }

    private size: number;

    constructor(material: string, size: number) {
        super(material);
        this.size = size;
    }

}

console.log(SubCake.pruduceFromChocFactory(4));
console.log(SubCake.pruduceFromChocFactory(8));


