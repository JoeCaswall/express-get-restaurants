const request = require("supertest");
const app = require("./src/app");
const {
  describe,
  it,
  toBe,
  toEqual,
  expect,
  beforeEach,
} = require("@jest/globals");
const { syncSeed } = require("./seed");
const express = require("express");
app.use(express.json());
app.use(express.urlencoded());

const { seedRestaurant, seedMenu, seedItem } = require("./seedData");

beforeEach(async () => {
  await syncSeed();
});

describe("GET /restaurants", () => {
  it("reaches endpoint successfully", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
  });
  it("returns an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    const responseData = JSON.parse(response.text);
    // console.log(responseData);
    expect(Array.isArray(responseData)).toBe(true);
  });
  it("array is correct length", async () => {
    const response = await request(app).get("/restaurants");
    const responseData = JSON.parse(response.text);
    expect(responseData.length).toBe(seedRestaurant.length);
  });
  it("array contains correct restaurant data", async () => {
    const response = await request(app).get("/restaurants");
    const responseData = JSON.parse(response.text);
    expect(responseData[0].name).toEqual(seedRestaurant[0].name);
    expect(responseData[0].location).toEqual(seedRestaurant[0].location);
    expect(responseData[0].cuisine).toEqual(seedRestaurant[0].cuisine);
    expect(responseData[1].name).toEqual(seedRestaurant[1].name);
    expect(responseData[1].location).toEqual(seedRestaurant[1].location);
    expect(responseData[1].cuisine).toEqual(seedRestaurant[1].cuisine);
    expect(responseData[2].name).toEqual(seedRestaurant[2].name);
    expect(responseData[2].location).toEqual(seedRestaurant[2].location);
    expect(responseData[2].cuisine).toEqual(seedRestaurant[2].cuisine);
  });
});

describe("GET/restaurants/:id", () => {
  it("returns correct data", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.body).toEqual({
      id: 1,
      name: "AppleBees",
      location: "Texas",
      cuisine: "FastFood",
    });
  });
});

describe("POST/restaurants", () => {
  it("adds a new restaurant correctly", async () => {
    await request(app)
      .post("/restaurants")
      .send({ name: "The Dough Shack", location: "Surrey", cuisine: "Pizza" });
    const allRestauarants = await request(app).get("/restaurants");
    const restaurantArray = JSON.parse(allRestauarants.text);
    expect(restaurantArray[restaurantArray.length - 1].name).toBe(
      "The Dough Shack"
    );
    expect(restaurantArray[restaurantArray.length - 1].location).toBe("Surrey");
    expect(restaurantArray[restaurantArray.length - 1].cuisine).toBe("Pizza");
  });
});

describe("PUT/restaurants/:id", () => {
  it("correctly updates restaurants array", async () => {
    await request(app)
      .put("/restaurants/1")
      .send({ name: "The Dough Shack", location: "Surrey", cuisine: "Pizza" });
    const allRestauarants = await request(app).get("/restaurants");
    const restaurantArray = JSON.parse(allRestauarants.text);
    expect(restaurantArray[0].name).toBe("The Dough Shack");
    expect(restaurantArray[0].location).toBe("Surrey");
    expect(restaurantArray[0].cuisine).toBe("Pizza");
  });
});

describe("DELETE/restaurants/:id", () => {
  it("deletes an entry from restaurant array", async () => {
    await request(app).delete("/restaurants/1");
    const allRestauarants = await request(app).get("/restaurants");
    const restaurantArray = JSON.parse(allRestauarants.text);
    expect(restaurantArray.length).toBe(2);
  });
  it("deletes correct entry from restaurant array", async () => {
    await request(app).delete("/restaurants/1");
    const allRestauarants = await request(app).get("/restaurants");
    const restaurantArray = JSON.parse(allRestauarants.text);
    expect(restaurantArray[0].name).toBe(seedRestaurant[1].name);
  });
});
