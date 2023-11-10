import * as Yup from "yup";
import Favorite from "../models/Favorite";
import Product from "../models/Product";
import User from "../models/User";

class FavoritesController {
  async index(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id);

    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    const favoritesUser = await Favorite.findAll({
      where: {
        user_id: id,
      },
    });

    const favorites = [];

    const promiseFavorites = favoritesUser.map(async (item) => {
      const product = await Product.findByPk(item.product_id, {
        attributes: { exclude: ["id"] },
      });

      if (product) {
        favorites.push({
          ...product.dataValues,
          ...item.dataValues,
        })
      }
    });

    await Promise.all(promiseFavorites);

    return response.status(200).json(favorites);
  }
  
  async create(request, response) {
    const schema = Yup.object().shape({
      product_id: Yup.number().required(),
      user_id: Yup.number().required(),
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

    const findFavorite = await Favorite.findOne({
      where: {
        user_id,
        product_id,
      },
    });

    if (findFavorite) {
      return response.status(400).json({ error: "The product is already on the list" });
    }

    await Favorite.create(request.body);

    return response.status(201).json({ message: "Product was been added on favorites "});
  }

  async delete(request, response) {
    const schema = Yup.object().shape({
      product_id: Yup.number().required(),
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { user_id, product_id } = request.body; 

    await Favorite.destroy({
      where: { 
        user_id,
        product_id
       },
    });
    
    return response.status(200).json({ message: "Favorite has been removed" });
  }
}

export default new FavoritesController();