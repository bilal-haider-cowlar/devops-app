function sum(numbers) {
  let sum = 0;
  for (const number of numbers) {
    if (typeof number !== "number") {
      throw new Error("All elements in array must be numbers");
    }
    sum += number;
  }
  return sum;
}

describe("Test sum functions", () => {
  it("Should return correct sum of numbers", () => {
    const numbers = [1, 2, 3, 4, 5];
    const numbersSum = sum(numbers);
    expect(numbersSum).toBe(15);
  });
  it("Should return error if invalid data is present in the number array", () => {
    const numbers = [1, 2, 3, 4, "5"];
    expect(() => {
      sum(numbers);
    }).toThrowError("All elements in array must be numbers");
  });
});
