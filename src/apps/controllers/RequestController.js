import * as Yup from "yup";
import Request from "../models/Request";
import Address from "../models/Address";
import Product from "../models/Product";
import ProductRequest from "../models/ProductRequest";

class RequestController {
  async index(request, response) {
    const requests = await Request.findAll({ 
      order: ['id'],
      attributes: { exclude: ["updatedAt"]},
      include: [
        {
          model: Address,
          attributes: { exclude: ["updatedAt", "createdAt", "RequestId", "request_id"]},
        },
        {
          model: ProductRequest,
          attributes: { exclude: ["updatedAt", "createdAt", "RequestId", "request_id"]},
        },
      ],
    });

    return response.status(200).json(requests);
  }

  async show(request, response) {
    const { id } = request.params;

    const findRequest = await Request.findByPk(id, {
      include: [
        {
          model: Address,
        },
        {
          model: ProductRequest,
        },
      ],
    });

    if (!findRequest) {
      return response.status(404).json({ error: "Request not found" });
    }

    return response.status(200).json(findRequest);
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      id_payment_mp: Yup.number().required(),
      status_request: Yup.string().required(),
      value: Yup.number().required(),
      address: Yup.object().shape({
        street: Yup.string().required(),
        number: Yup.number().required(),
        postal_code: Yup.string().required(),
        complement: Yup.string(),
        city: Yup.string().required(),
        state: Yup.string().required(),
      }).required(),
      products: Yup.array().of(
        Yup.object().shape({
          product_id: Yup.number().required(),
          quantity: Yup.number().required(),
        })
      ).required(),
    });
    
    if (! (await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" })
    }

    const requestCreate = await Request.create(request.body);

    await Address.create({
      ...request.body.address,
      request_id: requestCreate.id
    });

    for (let i = 0; i < request.body.products.length; i++) {
      const findProduct = await Product.findByPk(request.body.products[i].product_id)

      if (findProduct) {
        console.log("\n\n\nCriando...")
        await ProductRequest.create({
          ...request.body.products[i],
          request_id: requestCreate.id,
        })
      }
    }

    return response.status(201).json(requestCreate);
  }
};

export default new RequestController();