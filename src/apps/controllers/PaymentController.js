import "dotenv/config";
import mercadopago from "mercadopago";
import Address from "../models/Address";
import Request from "../models/Request";
import ProductRequest from "../models/ProductRequest";
import Product from "../models/Product";
import Cart from "../models/Cart";

mercadopago.configurations.setAccessToken(process.env.ACCESS_KEY_MERCADO_PAGO)

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

              await Product.update({
                quantity_products: findProduct.quantity_products - product.quantity,
                sales: findProduct.sales + 1,
              }, {
                where: {
                  id: Number(product.id),
                }
              })

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