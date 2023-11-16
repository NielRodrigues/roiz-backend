import Sequelize, { Op } from "sequelize";
import * as Yup from "yup";
import Category from "../models/Category";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class CategoryController {
  async index(request, response) {
    const { search } = request.query;

    let where = {};
    const order = [sequelize.literal("RANDOM()")];

    if (search) {
      where = {
        ...where,
        name: { [Op.substring]: search },
      };
    }

    const page = request.query.page || 1;
    const limit = request.query.limit || 20;

    const categories = await Category.findAll({
      order,
      where,
      limit,
      offset: limit * page - limit,
    });

    return response.status(200).json(categories);
  }

  async show(request, response) {
    const { id } = request.params;

    const findCategory = await Category.findByPk(id);

    if (!findCategory) {
      return response.status(404).json({ error: "Error category not found" });
    }

    return response.status(200).json(findCategory);
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      picture: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const category = await Category.create(request.body);

    return response.status(201).json(category);
  }

  async update(request, response) {
    const { id } = request.params;

    const findCategory = await Category.findByPk(id);

    if (!findCategory) {
      return response.status(404).json({ error: "Error category not found" });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      picture: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    await Category.update(request.body, { where: { id } });

    return response.status(200).json({ message: "Category has been updated" });
  }

  async delete(request, response) {
    const { id } = request.params;

    const findCategory = await Category.findByPk(id);

    if (!findCategory) {
      return response.status(404).json({ error: "Error category not found" });
    }

    await Category.destroy({ where: { id } });

    return response.status(200).json({ message: "Category has been deleted" });
  }
}

export default new CategoryController();
