import BigNumber from "bignumber.js";
import { getTotalBalance } from "./accountUtils";

describe("getTotalBalance", () => {
  test("getTotalBalance returns the right value", () => {
    const result = getTotalBalance({
      foo: new BigNumber(40),
      bar: null,
      baz: new BigNumber(60),
    });

    expect(result).toEqual(new BigNumber(100));
  });

  test("these edge cases should return null", () => {
    expect(getTotalBalance({})).toEqual(null);
    expect(
      getTotalBalance({
        foo: null,
        bar: null,
      })
    ).toEqual(null);
  });
});