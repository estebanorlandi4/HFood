const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");

const axios = require("axios");
const { Diet, Recipe } = require("../db");

const { complex, single } = require("./urls");
const validate = require("./validate");
const { dbObjFormat, apiObjFormat } = require("./objFormat");

const CreateResponse = (message, results) => {
  return {
    message,
    results,
  };
};

router.get("/recipes", async (req, res) => {
  const { name = "" } = req.query;

  try {
    const query = { include: [Diet] };
    if (name) query["where"] = { name };

    const dbData = dbObjFormat(await Recipe.findAll(query));
    const apiData = apiObjFormat(await axios.get(complex(name)));

    let results = [];
    if (!dbData && !apiData) throw Error({ message: "Recipes not found" });
    if (dbData) results = [...dbData];
    if (apiData) results = [...results, ...apiData];

    return res.status(200).json({ messaage: "Recipes founded", results });
  } catch (err) {
    if (err.response && err.response.data)
      return res.status(402).json({ message: "Daily points limit", err });
    return res.status(404).json({ message: "Something went wrong", err });
  }
});

router.get("/recipes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (id.includes("-")) {
      const dbData = dbObjFormat(
        await Recipe.findOne({ where: { id }, include: [Diet] })
      );

      if (dbData) {
        return res
          .status(200)
          .json(CreateResponse("Recipe found", dbData, null));
      }
    }

    const apiData = apiObjFormat(await axios.get(single(id)));
    if (!apiData) throw Error("Recipe not found");

    return res.status(200).json(CreateResponse("Recipe found", apiData));
  } catch (err) {
    return res.status(404).json({ message: "Recipe not found", err });
  }
});

router.get("/types", async (req, res) => {
  try {
    const diets = dbObjFormat(await Diet.findAll({ raw: true }));
    if (diets && diets.length)
      return res.status(200).json(CreateResponse("Diets found", diets));

    const { data: apiData } = await axios.get(complex(""));
    const arrDiets = {};

    for (let recipe of apiData.results) {
      for (let diet of recipe.diets) {
        if (!arrDiets[diet]) {
          let [getData, _] = await Diet.findOrCreate({
            where: { name: diet },
          });
          getData = getData.toJSON();
          if (getData) arrDiets[getData.name] = getData.name;
        }
      }
    }
    return res
      .status(200)
      .json(CreateResponse("Diets saved", Object.values(arrDiets)));
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/recipe", async (req, res) => {
  if (!validate(req.body))
    return res
      .status(400)
      .json({ message: "Invalid Data", err: { status: 400 } });
  const { title, summary, score, healthScore, steps, diets } = req.body;

  try {
    const dietsFound = diets.length
      ? await Diet.findAll({
          where: { name: { [Op.or]: diets } },
          include: [Recipe],
        })
      : [];

    const newRecipe = await Recipe.create(
      {
        title,
        summary,
        score,
        healthScore,
        steps,
      },
      { include: [Diet] }
    );

    if (dietsFound.length) await newRecipe.addDiets(dietsFound);

    const response = dbObjFormat(
      await Recipe.findOne({
        where: { id: newRecipe.id },
        include: [Diet],
      })
    );

    return res.status(200).json(CreateResponse("Recipe Created", response));
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;
