import * as Yup from "yup";
import Message from "../models/Message";
import User from "../models/User";

class MessageController {
  async index(request, response) {
    const messages = await Message.findAll({ order: [["id", "DESC"]] });

    const messagesWithUser = [];

    const promiseMessage = messages.map(async (item) => {
      const user = await User.findByPk(item.user_id);

      if (user) {
        messagesWithUser.push({
          ...item.dataValues,
          user: user.name,
          email: user.email,
        })
      }
    });

    await Promise.all(promiseMessage)
    
    return response.status(200).json(messagesWithUser);
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      subject: Yup.string().required(),
      message: Yup.string().required(),
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema." });
    }

    await Message.create(request.body)

    return response.status(201).json({ message: "Message was sended" });
  }
}

export default new MessageController();