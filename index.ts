class Value {
  data: number;
  operands: Set<Value>;
  operator: string;

  constructor(data: number, operandArr?: Array<Value>, operator?: string) {
    this.data = data;
    this.operands = new Set(operandArr);
    this.operator = operator ?? "";
  }

  add(other: Value) {
    const out = new Value(this.data + other.data);
    out.operands.add(this);
    out.operands.add(other);
    out.operator = "+";
    return out;
  }

  mul(other: Value) {
    const out = new Value(this.data * other.data);
    out.operands.add(this);
    out.operands.add(other);
    out.operator = "*";
    return out;
  }
}

function main() {
  const a = new Value(-1);
  const b = new Value(2);
  const c = new Value(5);
  const d = a.add(b).mul(c);
  console.log(d);
}

main();
