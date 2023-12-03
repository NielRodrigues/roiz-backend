import * as Yup from "yup";
import mercadopago from "mercadopago";
import Address from "../models/Address";
import Request from "../models/Request";
import ProductRequest from "../models/ProductRequest";
import Product from "../models/Product";
import Cart from "../models/Cart";

mercadopago.configurations.setAccessToken(
  "TEST-392570244808121-090809-8bf4c2362fc72d64eed1ef2c786a8368-565262359"
)

class PaymentController {
  async create(request, response) {
    mercadopago.payment
      .create(request.body)
      .then(async (data) => {
        if (data.body.status === "approved") {

          const requestCreate = await Request.create({
            user_id: request.body.metadata.user_id,
            value: request.body.metadata.value,
            id_payment_mp: data.body.id,

          });

          await Address.create({
            ...request.body.metadata.address,
            request_id: requestCreate.id
          });

          const promiseRequest = await request.body.additional_info.items.map(async (product) =>  {
            const findProduct = await Product.findByPk(Number(product.id))

            if (findProduct) {
              await ProductRequest.create({
                product_id: Number(product.id),
                quantity: product.quantity,
                request_id: requestCreate.id,
              });
            }
          });

          await Promise.all(promiseRequest);

          await Cart.destroy({ where: { user_id: request.body.metadata.user_id }})

          return response.status(200).json(data.body);
        }
      })
      .catch((error) => {
        console.error("\n\n\n error: \n", error)
        return response.status(400).json(error)
      })
  }
}

export default new PaymentController();