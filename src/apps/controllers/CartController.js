import * as Yup from "yup";
import Cart from "../models/Cart";
import User from "../models/User";
import Product from "../models/Product";


class CartController {
  async index(request, response) {
    const { id } = request.params;

    const findUser = await User.findByPk(id);

    if (!findUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const Items = await Cart.findAll({
      where: {
        user_id: id,
      },
      order: ["id"],
    });

    const CartItems = [];

    const PromiseCart = Items.map(async (item) => {
      const product = await Product.findByPk(item.product_id, {
        attributes: { exclude: ["id"] },
      });

      if (product) {
        CartItems.push({
          ...product.dataValues,
          ...item.dataValues,
        });
      }
    });

    await Promise.all(PromiseCart);

    return response.status(200).json(CartItems);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      product_id: Yup.number().required(),
      user_id: Yup.number().required(),
      quantity: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { product_id, user_id } = request.body;

    const findUser = await User.findByPk(user_id);

    if (!findUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const Items = await Cart.findAll({
      where: {
        user_id,
      },
    });

    const findProduct = await Product.findByPk(product_id);

    if (!findProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    const findProductOnCart = Items.filter(
      (item) => item.product_id === product_id
    );

    if (findProductOnCart.length > 0) {
      await Cart.update(request.body, {
        where: {
          product_id,
          user_id,
        },
      });

      return response
        .status(200)
        .json({ message: "Product has been added on Cart" });
    }

    await Cart.create({
      ...request.body,
      user_id,
    });

    return response
      .status(200)
      .json({ message: "Product has been added on Cart" });
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      product_id: Yup.number().required(),
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { product_id, user_id } = request.body;

    const findUser = await User.findByPk(user_id);

    if (!findUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const Items = await Cart.findAll({
      where: {
        user_id,
      },
    });

    const findProduct = await Product.findByPk(product_id);

    if (!findProduct) {
      return response.status(404).json({ error: "Product not found" });
    }

    const findProductOnCart = Items.filter(
      (item) => item.product_id === product_id
    );

    if (findProductOnCart.length > 0) {
      const findProductOnCartUser = await Cart.findOne({
        where: {
          product_id,
          user_id,
        },
      });
      await Cart.update(
        {
          ...request.body,
          quantity: findProductOnCartUser.quantity + 1,
        },
        {
          where: {
            product_id,
            user_id,
          },
        }
      );

      return response
        .status(200)
        .json({ message: "Product has been added on Cart" });
    }

    await Cart.create({
      ...request.body,
      user_id,
      quantity: 1,
    });

    return response
      .status(200)
      .json({ message: "Product has been added on Cart" });
  }

  async delete(request, response) {
    const { id } = request.params;

    await Cart.destroy({
      where: {
        id,
      },
    });

    return response
      .status(200)
      .json({ message: "Product has been deleted of Cart" });
  }
}

export default new CartController();
