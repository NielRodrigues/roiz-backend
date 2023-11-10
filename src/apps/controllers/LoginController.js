import * as Yup from "yup";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Cart from "../models/Cart";
import Favorite from "../models/Favorite";

class LoginController {
  async login(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password_hash: Yup.string(),
      password: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema." });
    }

    const { email, password, password_hash } = request.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Cart,
          order: ["id"],
        },
      ],
    });

    if (user) {
      const favorites = [];

      const favoritesUser = await Favorite.findAll({
        where: {
          user_id: user.id,
        },
      });
  
      const promiseFavorites = favoritesUser.map((item) => {
        favorites.push(item.product_id)
      })
  
      await Promise.all(promiseFavorites);

      if (password && (await bcrypt.compare(password, user.password_hash))) {
        return response.status(200).json({
          ...user.dataValues,
          favorites,
        });
      }

      if (password_hash && password_hash === user.password_hash) {
        return response.status(200).json({
          ...user.dataValues,
          favorites,
        });
      }

      return response.status(401).json({ error: "Password is wrong" });
    }

    return response.status(404).json({ error: "This email is not registered" });
  }
}

export default new LoginController();
