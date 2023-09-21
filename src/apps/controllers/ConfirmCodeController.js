import * as Yup from "yup";
import bcrypt from "bcryptjs";

class ConfirmCodeController {
  async create(request, response) {
    const schema = Yup.object().shape({
      code: Yup.string().required(),
      hash: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" });
    }

    const { code, hash } = request.body;

    if (await bcrypt.compare(code, hash)) {
      return response.status(200).json({ message: "Ok" });
    }

    return response.status(401).json({ error: "Code wrong" });
  }
}

export default new ConfirmCodeController();
