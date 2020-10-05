class Boat {
  color: string = "red";

  //or @testDecorator: this key will be formattedColor String
  get formattedColor(): string {
    return `this boat's color is ${this.color}`;
  }

  @testDecorator // whenever we assign decorator which position, the key will be string, like this 'pilot'
  pilot(): void {
    console.log("Ben Lee");
  }
}

function testDecorator(target: any, key: string): void {
  console.log("Target: ", target);
  console.log("Key:", key);
}

//Important Note: when we pass the argument target, that target will point to class as prototype as Boat.prototype.
// Remember: the prototype only generate the methods definition inside the class. The Protype never access the instance of the class
//in general that will result in func args (target= Boat.prototype, key = 'pilot', null)

//Third Argument will be property description

//decorators are applied when the code for the class is ran
//(Not when an instance is created)

@classDecorator
class Boat2 {
  @testDecorator2
  color: string = "blue";

  @testDecorator2
  get formatColor(): string {
    return `this boat2's color is ${this.color}`;
  }

  @logError("Boat2 was sunk in occean")
  pilot(
    @parameterDecorator speed: string,
    @parameterDecorator generateWake: boolean
  ): void {
    // throw new Error();
    if (speed === "fast") {
      console.log("swish");
    } else {
      console.log("nothing");
    }
  }
}

function classDecorator(constructor: typeof Boat2) {
  console.log("classDecorator", constructor);
}

function parameterDecorator(target: any, key: string, index: number) {
  console.log(key, index);
}

function testDecorator2(target: any, key: string): void {
  console.log("Target of Boat2 : ", target);
  console.log("key of Boat2: ", key);
}

function logError(errorMessage: string) {
  return function (target: any, key: string, desc: PropertyDescriptor): void {
    const method = desc.value; //reference to pilot()
    desc.value = function () {
      try {
        method();
      } catch (e) {
        console.log(errorMessage);
      }
    };
  };
}

console.log("\n");
// new Boat2().pilot(); // 'Oops! Boat2 was sunk!'
console.log("\n");

//the idea is whenever we call pilot method in class Boat2
//and we wanna navigate an error, we make sure that decorator somehow catches that error, and report to us that as console.log in function logError();
//we need third arg desc: PropertyDescriptor

//PropertyDescriptor
//It is essentially an Object that is configured a property on another Object
//PropertyDescriptor for methods:
// writable: Whether or not this property can be changed (boolean: true or false)
// enumerable: Whether or not this property get looped over 'for...in'
// value: current value
// configurable: property definition can be changed or can be deleted

//Example in JS:

const car = { make: "Honda", year: 2000 };
const getProperty = Object.getOwnPropertyDescriptor(car, "make");
console.log(getProperty);
//result
//{ value: 'Honda',
// writable: true,
// enumerable: true,
// configurable: true }

const defineProperty = Object.defineProperty(car, "make", { writable: false });
console.log(defineProperty); // this will result no change { make: 'Honda', year: 2000 }
// but the writable will turn to false, and that will cause cannot make a change
//car.make = "chevy"; // this will cause an error cannot assign to read only property 'make' of object
