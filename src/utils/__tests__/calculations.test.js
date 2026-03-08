import { calculateBreadRecipe } from "../calculations";

describe("calculateBreadRecipe", () => {
  it("returns base amounts for 1 loaf", () => {
    expect(calculateBreadRecipe(1)).toEqual({
      starter: 100,
      flour: 400,
      water: 280,
      salt: 8,
    });
  });

  it("scales linearly for 2 loaves", () => {
    expect(calculateBreadRecipe(2)).toEqual({
      starter: 200,
      flour: 800,
      water: 560,
      salt: 16,
    });
  });

  it("scales correctly for 5 loaves", () => {
    expect(calculateBreadRecipe(5)).toEqual({
      starter: 500,
      flour: 2000,
      water: 1400,
      salt: 40,
    });
  });

  it("clamps 0 to 1 loaf", () => {
    expect(calculateBreadRecipe(0)).toEqual({
      starter: 100,
      flour: 400,
      water: 280,
      salt: 8,
    });
  });

  it("clamps negative input to 1 loaf", () => {
    expect(calculateBreadRecipe(-3)).toEqual({
      starter: 100,
      flour: 400,
      water: 280,
      salt: 8,
    });
  });

  it("clamps values above 10 to 10 loaves", () => {
    expect(calculateBreadRecipe(15)).toEqual({
      starter: 1000,
      flour: 4000,
      water: 2800,
      salt: 80,
    });
  });

  it("rounds fractional input (1.7 -> 2 loaves)", () => {
    expect(calculateBreadRecipe(1.7)).toEqual({
      starter: 200,
      flour: 800,
      water: 560,
      salt: 16,
    });
  });

  it("rounds fractional input (2.3 -> 2 loaves)", () => {
    expect(calculateBreadRecipe(2.3)).toEqual({
      starter: 200,
      flour: 800,
      water: 560,
      salt: 16,
    });
  });
});
