import * as Yup from "yup";
import Request from "../models/Request";
import Address from "../models/Address";
import Product from "../models/Product";
import ProductRequest from "../models/ProductRequest";
import User from "../models/User";
import { Op } from "sequelize";

class RequestController {
  async index(request, response) {
    const { search, status } = request.query;
    let where = {};

    if (search && Number(search)) {
      where = {
        ...where,
        id: search,
      };
    }

    if (status) {
      where = {
        ...where,
        status_request: { [Op.iLike]: status }
      }
      ;
    }

    const page = request.query.page || 1;
    const limit = request.query.limit || 20;

    const requests = await Request.findAll({ 
      order: ["id"],
      attributes: { exclude: ["updatedAt"]},
      include: [
        {
          model: Address,
          attributes: { exclude: ["updatedAt", "createdAt", "RequestId", "request_id", "id"]},
        },
        {
          model: ProductRequest,
          attributes: { exclude: ["updatedAt", "createdAt", "RequestId", "request_id", "id"]},
        },
      ],
      limit,
      where,
      offset: limit * page - limit,
    });

    const requestWithUser = [];

    const requestPromise = requests.map(async (item) => {
      const findUser = await User.findByPk(item.user_id, { attributes: { exclude: ["updatedAt", "createdAt", "password_hash"] }})
    
      if (findUser) {
        const productRequests = [];

        const productsPromise = item.product_requests.map(async (product) => {
            const findProduct = await Product.findByPk(product.product_id, { attributes: { exclude: ["updatedAt", "createdAt", "id", "price_of"] }})

            if (findProduct) {
              productRequests.push({
                ...product.dataValues,
                picture: findProduct.picture,
                name: findProduct.name,
                price_purchase: findProduct.price_purchase,
              })
            }
          
        });

        await Promise.all(productsPromise)

        requestWithUser.push({
          ...item.dataValues,
          name: findUser.name,
          email: findUser.email,
          tel: findUser.tel,
          product_requests: productRequests
        })
      }
    });

    await Promise.all(requestPromise)

    return response.status(200).json(requestWithUser);
  }

  async showUser(request, response) {
    const { id } = request.params;

    const findUser = await User.findByPk(id);

    if (!findUser) {
      return response.status(404).json({ error: "User not found" });
    }

    const { search } = request.query;
    
    let where = {
      user_id: id,
    };

    if (search && Number(search)) {
      where = {
        ...where,
        id: search,
      }
    }

    const page = request.query.page || 1;
    const limit = request.query.limit || 20;

    const requests = await Request.findAll({ 
      order: ["id"],
      attributes: { exclude: ["updatedAt"]},
      include: [
        {
          model: Address,
          attributes: { exclude: ["updatedAt", "createdAt", "RequestId", "request_id", "id"]},
        },
        {
          model: ProductRequest,
          attributes: { exclude: ["updatedAt", "createdAt", "RequestId", "request_id", "id"]},
        },
      ],
      limit,
      where,
      offset: limit * page - limit,
    });

    const requestWithUser = [];

    const requestPromise = requests.map(async (item) => {
      const findUser = await User.findByPk(item.user_id, { attributes: { exclude: ["updatedAt", "createdAt", "password_hash"] }})
    
      if (findUser) {
        const productRequests = [];

        const productsPromise = item.product_requests.map(async (product) => {
            const findProduct = await Product.findByPk(product.product_id, { attributes: { exclude: ["updatedAt", "createdAt", "id", "price_of"] }})

            if (findProduct) {
              productRequests.push({
                ...product.dataValues,
                picture: findProduct.picture,
                name: findProduct.name,
                price_purchase: findProduct.price_purchase,
              })
            }
          
        });

        await Promise.all(productsPromise)

        requestWithUser.push({
          ...item.dataValues,
          name: findUser.name,
          email: findUser.email,
          tel: findUser.tel,
          product_requests: productRequests
        })
      }
    });

    await Promise.all(requestPromise)

    return response.status(200).json(requestWithUser);
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
      value: Yup.number().required(),
      address: Yup.object().shape({
        street: Yup.string().required(),
        neighborhood: Yup.string().required(),
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
        await ProductRequest.create({
          ...request.body.products[i],
          request_id: requestCreate.id,
        })
      }
    }

    return response.status(201).json(requestCreate);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      status_request: Yup.string(),
    });
    
    if (! (await schema.isValid(request.body))) {
      return response.status(400).json({ error: "Error on validate schema" })
    }

    const { id } = request.params;

    const findRequest = await Request.findByPk(id);

    if (!findRequest) {
      return response.status(404).json({ error: "Request not found" });
    }

    await Request.update(request.body, { where: { id }} )

    return response.status(200).json({ mesange: "Request was been updated"});
  }
};

export default new RequestController();