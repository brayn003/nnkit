class Value {
  data: number;
  gradient: number;
  operands: Set<Value>;
  operator: string;
  calcOperandGradients: Function;

  constructor(data: number, operandArr?: Array<Value>, operator?: string) {
    this.data = data;
    this.gradient = 0;
    this.operands = new Set(operandArr);
    this.operator = operator ?? "";
    this.calcOperandGradients = () => {};
  }

  toString() {
    return `Value (data=${this.data}, grad=${this.gradient})`;
  }

  add(other: Value) {
    const out = new Value(this.data + other.data);
    out.operands.add(this);
    out.operands.add(other);
    out.operator = "+";
    out.calcOperandGradients = () => {
      this.gradient += out.gradient * 1;
      other.gradient += out.gradient * 1;
    };
    return out;
  }

  mul(other: Value) {
    const out = new Value(this.data * other.data);
    out.operands.add(this);
    out.operands.add(other);
    out.operator = "*";
    out.calcOperandGradients = () => {
      this.gradient += out.gradient * other.data;
      other.gradient += out.gradient * this.data;
    };
    return out;
  }

  backward() {
    // arranging the compute graph linerally
    const topo: Array<Value> = [];
    const visited = new Set();
    const buildTopo = (a: Value) => {
      if (!visited.has(a)) {
        visited.add(a);
        for (const operand of a.operands) {
          buildTopo(operand);
        }
        topo.push(a);
      }
    };
    buildTopo(this);

    // generating all gradients
    this.gradient = 1;
    for (const item of topo.toReversed()) {
      item.calcOperandGradients();
    }
  }
}

function example1() {
  // simple equation
  // ab + c
  const a = new Value(-1);
  const b = new Value(3);
  const c = new Value(5);
  const d = a.mul(b).add(c);
  d.backward();
  console.log(a.toString());
  console.log(b.toString());
  console.log(c.toString());
  console.log(d.toString());
}

function example2() {
  // simple scalar perceptron
  // x1w1 + x2w2 + b
  const x1 = new Value(-1);
  const x2 = new Value(4);
  const w1 = new Value(3);
  const w2 = new Value(-3);
  const b = new Value(2);

  const x1w1 = x1.mul(w1);
  const x2w2 = x2.mul(w2);
  const o = x1w1.add(x2w2).add(b);
  o.backward();
  console.log(x1.toString());
  console.log(x2.toString());
  console.log(w1.toString());
  console.log(w2.toString());
  console.log(b.toString());
  console.log(x1w1.toString());
  console.log(x2w2.toString());
  console.log(o.toString());
}

function main() {
  // example1();
  example2();
}

main();
