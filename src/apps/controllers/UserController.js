/* eslint-disable import/no-extraneous-dependencies */
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Cart from "../models/Cart";
import Favorite from "../models/Favorite";

class UserController {
  async index(request, response) {
    const{ search } = request.query; 

    let where = {};

    if (search) {
      if(Number(search)) {
        where = {
          ...where,
          id: Number(search)
        };
      }
    }

    const users = await User.findAll({ 
      attributes: { exclude: ["password_hash" ]},
      order: ["id"], 
      where,
    });

    return response.status(200).json(users);
  }

  async show(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash" ]},
      include: [
        {
          model: Cart,
          order: ["id"],
        },
      ],
    });

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    const favorites = []

    const favoritesUser = await Favorite.findAll({
      where: {
        user_id: id,
      },
    });

    const promiseFavorites = favoritesUser.map((item) => {
      favorites.push(item.product_id)
    })

    await Promise.all(promiseFavorites);

    return response.status(200).json({
      ...user.dataValues,
      favorites
    });
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      tel: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(8),
      token: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { email } = request.body;
    const findUser = await User.findOne({ where: { email } });

    if (findUser) {
      return response
        .status(403)
        .json({ error: "This email has been sign up" });
    }

    const { id, name, token, createdAt, updatedAt } = await User.create({
      ...request.body,
      token: process.env.USER_TOKEN,
    });

    return response
      .status(201)
      .json({ id, name, email, token, createdAt, updatedAt });
  }

  async update(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id);

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      tel: Yup.string(),
      password: Yup.string().min(8),
      token: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema " });
    }

    const updateFields = { ...request.body };

    const { password } = request.body;
    if (password) {
      updateFields.password_hash = await bcrypt.hash(password, 8);
    }

    await User.update(updateFields, {
      where: {
        id,
      },
    });

    return response
      .status(200)
      .json({ message: `The user with id ${id} was been updated` });
  }
}

export default new UserController();
