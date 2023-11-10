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
    const dataPurchase = JSON.parse(request.body.description.replace(/'/g, '"'))
    mercadopago.payment
      .create(request.body)
      .then(async (data) => {
        if (data.body.status === "approved") {

          const requestCreate = await Request.create({
            user_id: dataPurchase.user_id,
            value: dataPurchase.value,
            id_payment_mp: data.body.id,

          });

          await Address.create({
            ...dataPurchase.address,
            request_id: requestCreate.id
          });

          for (let i = 0; i < dataPurchase.products.length; i++) {
            const findProduct = await Product.findByPk(dataPurchase.products[i].product_id)

            if (findProduct) {
              await ProductRequest.create({
                ...dataPurchase.products[i],
                request_id: requestCreate.id,
              })
            }
          }

          await Cart.destroy({ where: { user_id: dataPurchase.user_id }})

          return response.status(200).json(data.body);
        }
      })
      .catch((error) => {
        console.log(error)
        return response.status(400).json(error)
      })
  }
}

export default new PaymentController();