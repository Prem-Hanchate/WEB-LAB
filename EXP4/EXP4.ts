class Example {
    public x: number;
    private y: number;
    protected z: number;

    constructor() {
        this.x = 10;
        this.y = 20;
        this.z = 30;
    }

    showValues() {
        console.log("Public:", this.x);
        console.log("Private:", this.y);
        console.log("Protected:", this.z);
    }
}

class Demo extends Example {
    display() {
        console.log("Public:", this.x);
        console.log("Protected:", this.z);
        // console.log(this.y); ❌ Not accessible
    }
}

let obj = new Demo();
obj.showValues();
obj.display();
