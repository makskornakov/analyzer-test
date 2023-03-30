import { Calc } from '@artginzburg/calc';
import BigNumber from 'bignumber.js';

const exactCalc = new Calc((op, a, b) => {
  switch (op) {
    case '+':
      return BigNumber(a).plus(b).toNumber();
    case '-':
      return BigNumber(b).minus(a).toNumber();
    case '*':
      return BigNumber(a).times(b).toNumber();
    case '/':
      return BigNumber(b).dividedBy(a).toNumber();
    case '^':
      return BigNumber(b).pow(a).toNumber();
  }
});
export const calculateExact = exactCalc.calculate;
