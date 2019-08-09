class Burger {
    protected size: number;
    protected cheese: boolean = false;
    protected pepperoni: boolean = false;
    protected lettuce: boolean = false;
    protected tomato: boolean = false;

    // tslint:disable-next-line:max-line-length
    // constructor({ size = 4, cheese = true, pepperoni = true, lettuce = true, tomato = true }: { size?: number; cheese?: boolean; pepperoni?: boolean; lettuce?: boolean; tomato?: boolean; } = {}) {
    //     this.size = size;
    //     this.cheese = cheese;
    //     this.pepperoni = pepperoni;
    //     this.lettuce = lettuce;
    //     this.tomato = tomato;
    // }

    constructor(size: number) {
        this.size = size;
    }

    public setCheese(cheese: boolean): void { this.cheese = cheese; }
    public setPepperoni(pepperoni: boolean): void { this.pepperoni = pepperoni; }
    public setLettuce(lettuce: boolean) { this.lettuce = lettuce; }
    public setTomato(tomato: boolean) { this.tomato = tomato; }
}

class BurgerBuilder {
    protected burger: Burger;

    public createNewBurgerProduct(size: number = 4): void {
        this.burger = new Burger(size);
    }
    public addCheese(): BurgerBuilder {
        this.burger.setCheese(true);
        return this;
    }
    public addPepperoni(): BurgerBuilder {
        this.burger.setPepperoni(true);
        return this;
    }
    public addLettuce() {
        this.burger.setLettuce(true);
        return this;
    }
    public addTomato() {
        this.burger.setTomato(true);
        return this;
    }
    public build(): Burger {
        return this.burger;
    }
}

class Watier {
    private burgerBuilder: BurgerBuilder;

    public setBurgerBuilder(burgerBuilder: BurgerBuilder): void {
        this.burgerBuilder = burgerBuilder;
    }
    public getBurger() {
        return this.burgerBuilder.build();
    }
    public constructPackageA() {
        this.burgerBuilder.createNewBurgerProduct();
        this.burgerBuilder.addCheese();
        this.burgerBuilder.addTomato();
    }
}

const builder: BurgerBuilder = new BurgerBuilder();

builder.createNewBurgerProduct();
builder.addCheese();
builder.addPepperoni();

console.log(builder.build());

interface ISomeProps {
    a: string
    b: () => void
}