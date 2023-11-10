import * as Yup from "yup";
import Rate from "../models/Rate";
import User from "../models/User";
import Product from "../models/Product";

class RateController {
  async index(request, response) {
    const { product_id } = request.query;

    let where = {};

    if (product_id) {
      where = {
        ...where,
        product_id,
      };
    }

    const limit = request.query.limit || 20;
    const page = request.query.page || 1;

    const rates = await Rate.findAll({ 
      order: [["id", "DESC"]],
      where,
      limit,
      offset: limit * page - limit
    });

    let ratesWithUser = [];

    const promiseRates = rates.map(async (item) => {
      const findUser = await User.findByPk(item.user_id)

      if(findUser) {
        ratesWithUser.push({
          ...item.dataValues,
          user: findUser.name
        });
      }
    });

    await Promise.all(promiseRates)

    return response.status(200).json(ratesWithUser); 
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      product_id: Yup.number().required(),
      user_id: Yup.number().required(),
      message: Yup.string().required(),
      stars: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { user_id, product_id } = request.body; 

    const findUser = await User.findByPk(user_id);
    if (!findUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const findProduct = await Product.findByPk(product_id);
    if (!findProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    const rate = await Rate.create(request.body)

    return response.status(201).json(rate)
  }

  async delete(request, response) {
    const { id } = request.params

    const findRate = await Rate.findByPk(id);
    if (!findRate) {
      return response.status(404).json({ error: "Rate not found" });
    }

    await Rate.destroy({ where: { id }} );

    return response.status(200).json({ message: "Rate was deleted" })
  }
}

export default new RateController();