import {Cloneable, CloneableArgs} from "cloneable-ts";

interface IPrototypeArgs {
    readonly name: string;
    readonly age: number;
}

class Prototype extends Cloneable<{}> implements CloneableArgs<IPrototypeArgs> {
    public readonly name: string;
    public readonly age: number;

    constructor(args) {
        // Cloneable abstract class initializes the object with super method and adds the clone method
        super(args);
    }
}

const subjectA = new Prototype({ name: "Alice", age: 28 });
const subjectB = subjectA.clone({ name: "Bob" });

console.log(subjectA.name); // Alice
console.log(subjectB.name); // Bob
console.log(subjectB.age); // 28

class PrototypeFactory {
    public static produce(type: string): Prototype {
        switch (type) {
            case "subjectA": {
                return this.subject.clone();
            }
            case "subjectB": {
                return this.subject.clone({ name: "Bob" });
            }
        }
    }
    protected static subject: Prototype = new Prototype({ name: "Alice", age: 28 });
}
