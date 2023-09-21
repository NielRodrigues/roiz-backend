import * as Yup from "yup";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";
import Mail from "../../lib/Mail";
import User from "../models/User";

class ForgotPassword {
  async sendCode(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema." });
    }

    const { email } = request.body;

    const findUser = await User.findOne({ where: { email } });

    if (!findUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const codeConfirmation = Math.floor(Math.random() * 900000) + 100000;
    const codeHash = await bcrypt.hash(String(codeConfirmation), 8);

    Mail.send({
      to: email,
      subject: "ROIZ | Código de confirmação > Troca de senha",
      text: `Olá, o seu código de confirmação para troca de senha é: ${codeConfirmation}\nSe não for você apenas ignore esse email!`,
    });

    return response.status(200).json({ code: codeHash });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema " });
    }

    const updateFields = { ...request.body };

    const { password, email } = request.body;

    const findUser = await User.findOne({ where: { email } });

    if (!findUser) {
      return response.status(404).json({ error: "User not found" });
    }

    if (password) {
      updateFields.password_hash = await bcrypt.hash(password, 8);
    }

    await User.update(updateFields, {
      where: {
        email,
      },
    });

    Mail.send({
      to: email,
      subject: "ROIZ | Senha alterada",
      text: `Olá ${findUser.name}, a sua senha foi alterada com sucesso.`,
    });

    return response
      .status(200)
      .json({ message: `The user with was been updated` });
  }
}

export default new ForgotPassword();
