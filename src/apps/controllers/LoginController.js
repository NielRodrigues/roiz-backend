import * as Yup from "yup";
import bcrypt from "bcryptjs";
import User from "../models/User";

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
    });

    if (user) {
      if (password && (await bcrypt.compare(password, user.password_hash))) {
        return response.status(200).json(user);
      }

      if (password_hash && password_hash === user.password_hash) {
        return response.status(200).json(user);
      }

      return response.status(401).json({ error: "Password is wrong" });
    }

    return response.status(404).json({ error: "This email is not registered" });
  }
}

export default new LoginController();
