import Sequelize, { Op } from "sequelize";
import * as Yup from "yup";
import Product from "../models/Product";
import Favorite from "../models/Favorite";
import Rate from "../models/Rate";
import config from "../../config/database";

const sequelize = new Sequelize(config);

class ProductController {
  async index(request, response) {
    const { search, category, excepct } = request.query;

    let where = {};
    const order = [sequelize.literal("RANDOM()")];

    if (search) {
      where = {
        ...where,
        name: { [Op.substring]: search },
      };
    }

    if (excepct) {
      where = {
        ...where,
        id: { [Op.not]: excepct }
      };
    }

    if (category) {
      where = {
        ...where,
        category: { [Op.iLike]: category },
      };
    }

    const page = request.query.page || 1;
    const limit = request.query.limit || 20;

    const products = await Product.findAll({
      order,
      where,
      limit,
      offset: limit * page - limit,
    });

    const productInfo = [];

    const promiseProducts =  products.map(async (item) => {
      const likes = await Favorite.count({ where: { product_id: item.id }});
      const rates_count = await Rate.count({ where: { product_id: item.id }});
      const sum = await Rate.sum("stars", { where: { product_id: item.id }});
      
    
      productInfo.push({
        ...item.dataValues,
        likes,
        rates_count,
        avg: rates_count > 0 ? sum / rates_count : 0,
      });
    });

    await Promise.all(promiseProducts)

    return response.status(200).json(productInfo);
  }

  async show(request, response) {
    const { id } = request.params;

    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    const likes = await Favorite.count({ where: { product_id: id }});
    const rates_count = await Rate.count({ where: { product_id: id }});
    const sum = await Rate.sum("stars", { where: { product_id: id }});

    return response.status(200).json({
      ...findProduct.dataValues,
      likes,
      rates_count,
      avg: rates_count > 0 ? sum / rates_count : 0,
    });
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      picture: Yup.string().required(),
      price_of: Yup.number().required(),
      price_purchase: Yup.number().required(),
      type: Yup.string(),
      link: Yup.string(),
      affiliation: Yup.string(),
      description: Yup.string().required(),
      category: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const product = await Product.create(request.body);

    return response.status(201).json(product);
  }

  async update(request, response) {
    const { id } = request.params;

    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      picture: Yup.string(),
      price_of: Yup.number(),
      price_purchase: Yup.number(),
      type: Yup.string(),
      link: Yup.string(),
      affiliation: Yup.string(),
      description: Yup.string(),
      category: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    await Product.update(request.body, { where: { id } });

    return response.status(200).json({ message: "Product has been updated" });
  }

  async delete(request, response) {
    const { id } = request.params;

    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    await Product.destroy({ where: { id } });

    return response.status(200).json({ message: "Product has been deleted" });
  }
}

export default new ProductController();
