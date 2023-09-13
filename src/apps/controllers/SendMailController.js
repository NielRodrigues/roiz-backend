import * as Yup from "yup";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";
import Mail from "../../lib/Mail";

class SendMailController {
  async codeConfirmation(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema." });
    }

    const { name, email } = request.body;

    const codeConfirmation = Math.floor(Math.random() * 900000) + 100000;
    const codeHash = await bcrypt.hash(String(codeConfirmation), 8);

    Mail.send({
      to: email,
      subject: "ROIZ | Código de confirmação",
      text: `Olá ${name}, o seu código de confirmação é ${codeConfirmation}`,
    });

    return response.status(200).json({ code: codeHash });
  }
}

export default new SendMailController();
