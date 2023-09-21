import * as Yup from "yup";
import Product from "../models/Product";

class ProductController {
  async index(request, response) {
    const page = request.query.page || 1;
    const limit = request.query.page || 20;

    const products = await Product.findAll({
      order: ["id"],
      limit,
      offset: limit * page - limit,
    });

    return response.status(200).json(products);
  }

  async show(request, response) {
    const { id } = request.params;

    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    return response.status(200).json(findProduct);
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
