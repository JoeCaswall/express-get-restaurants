const express = require("express");
const app = express();
const Restaurant = require("../models/index");
const db = require("../db/connection");

//TODO: Create your GET Request Route Below:

app.get("/restaurants", async (req, res) => {
  const restaurantList = await Restaurant.findAll();
  res.json(restaurantList);
});

app.get("/restaurants/:id", async (req, res) => {
  const restaurantID = req.params.id;
  const particularRestaurant = await Restaurant.findByPk(restaurantID);
  res.json(particularRestaurant);
});

app.use(express.json());
app.use(express.urlencoded());

app.post("/restaurants", async (req, res) => {
  const newRestaurant = await Restaurant.create(req.body);
  res.json(newRestaurant);
});

app.put("/restaurants/:id", async (req, res) => {
  await Restaurant.update(req.body, {
    where: { id: req.params.id },
  });
  const allRestauarants = await Restaurant.findAll();
  res.json(allRestauarants);
});

app.delete("/restaurants/:id", async (req, res) => {
  const deletedRestaurant = await Restaurant.destroy({
    where: { id: req.params.id },
  });
  res.json(deletedRestaurant);
});

module.exports = app;
