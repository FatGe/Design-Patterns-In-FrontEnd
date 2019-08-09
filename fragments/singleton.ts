declare var global: any;
declare var window: Window;

let root: any = null;

class Menu {
    public static getInstance(): Menu {
        return Menu.instance;
    }
    private static instance = new Menu();

    private constructor() {}
}

try {
    root = typeof global === "object" ? global : window;
    root.Menu = Menu.getInstance();
} catch (e) {
    console.error(e);
}

console.log(root.Menu);
