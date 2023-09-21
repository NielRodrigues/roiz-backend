import * as Yup from "yup";
import User from "../models/User";

class RegisterController {
  async create(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
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

    return response.status(200).json({ message: "Ok" });
  }
}

export default new RegisterController();
