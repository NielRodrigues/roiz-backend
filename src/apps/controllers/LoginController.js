import { promisify } from "util";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Cart from "../models/Cart";
import Favorite from "../models/Favorite";

class LoginController {
  async login(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      token: Yup.string(),
      password: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema." });
    }
    
    const verifyAsync = promisify(jwt.verify);

    const { email, password, token } = request.body;

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
          password_hash: undefined,
          tokenAccess: jwt.sign({ id: user.id }, "h9rawcp42duapyxpsdb96u8a3l3qr7kg", {
            expiresIn: "7d"
          })
        });
      }

      if (token) {
        try {
          const decoded = await verifyAsync(token, "h9rawcp42duapyxpsdb96u8a3l3qr7kg")
          request.userId = decoded.id

          if (decoded.id === user.id) {
            return response.status(200).json({
              ...user.dataValues,
              password_hash: undefined,
              favorites,
              tokenAccess: jwt.sign({ id: user.id }, "h9rawcp42duapyxpsdb96u8a3l3qr7kg", {
                expiresIn: "7d"
              })
            });
          }

          return response.status(401).json({ error: "Token is of other user" });

        } catch (error) {
            return response.status(401).json({ error: "Token invalid" });
        }
      }

      return response.status(401).json({ error: "Password is wrong" });
    }

    return response.status(404).json({ error: "This email is not registered" });
  }
}

export default new LoginController();
