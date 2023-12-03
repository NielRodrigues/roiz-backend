import Sequelize, { Op } from "sequelize";
import Request from "../models/Request";
import config from "../../config/database";
import ProductRequest from "../models/ProductRequest";
import Product from "../models/Product";

const sequelize = new Sequelize(config);

class ChartController {
  async index(request, response) {
    const { month, year, today } = request.query;

    if (!month || !year || !today) {
      return response.status(404).json({ error: "Provider a date" })
    }

    const valueMonth = await Request.sum("value", {
      where: {
        [Op.and]: [
          {createdAt: { [Op.gte]: `${month}-1-${year}`}},
          {createdAt: { [Op.lt]: `${month == 12 ? "1" : Number(month) + 1}-1-${month == 12 ? Number(year) + 1 : year}`}},
        ],
      }
    })

    const valueTotal = await Request.sum("value")

    const salesMonth = await Request.count({
      where: {
        [Op.and]: [
          {createdAt: { [Op.gte]: `${month}-1-${year}`}},
          {createdAt: { [Op.lt]: `${month == 12 ? "1" : Number(month) + 1}-1-${month == 12 ? Number(year) + 1 : year}`}},
        ],
        status_request: { [Op.not]: "canceled"},
      }
    })

    const salesDay = await Request.count({
      where: {
        [Op.and]: [
          {createdAt: { [Op.gte]: today}},
        ],
        status_request: { [Op.not]: "canceled"},
      }
    })

    const salesTotal = await Request.count({ where: { status_request: { [Op.not]: "canceled" }}})

    const topFive = await ProductRequest.findAll({
      where: {
        [Op.and]: [
          {createdAt: { [Op.gte]: `${month}-1-${year}`}},
          {createdAt: { [Op.lt]: `${month == 12 ? "1" : Number(month) + 1}-1-${month == 12 ? Number(year) + 1 : year}`}},
        ],
      },
      attributes: ['product_id', [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity']],
      group: ['product_id'],
      order: [[Sequelize.literal('total_quantity'), 'DESC']],
      limit: 10, 
    });

    const topProducts = [];
    const salesMonths = [];

    const date = new Date()
    
    let monthValue = Number(date.getMonth()+1)
    let yearValue = Number(date.getFullYear())

    console.log("\n\nMonth >>> ", monthValue)
    console.log("Year >>> ", yearValue)

    console.log("\n\n\n\n")

    for (let i = 1; i <= 12; i++) {
      if(monthValue <= 1) {
        monthValue = 12 
        yearValue = yearValue - 1
      }
      
      console.log(`\n\n${i}.`)
      const sales = await Request.count({
        where: {
          [Op.and]: [
            {createdAt: { [Op.gte]: `${monthValue}-1-${yearValue}`}},
            {createdAt: { [Op.lt]: `${monthValue == 12 ? "1" : Number(monthValue) + 1}-1-${monthValue == 12 ? yearValue + 1 : yearValue}`}},
          ],
          status_request: { [Op.not]: "canceled"},
        }
      })

      salesMonths.unshift(sales)
      monthValue--
    }

    console.log("\n\n\n\n")

    const PromiseTopFive = topFive.map(async (item) => {
      const product = await Product.findByPk(item.product_id)

      if(product) {
        topProducts.push({
          ...item.dataValues,
          picture: product.picture,
          name: product.name,
        })
      }
    });

    await Promise.all(PromiseTopFive);

    return response.status(200).json({
      value_total: valueTotal ? valueTotal : 0,
      value_month: valueMonth ? valueMonth : 0,
      sales_month: salesMonth ? salesMonth : 0,
      sales_total: salesTotal ? salesTotal : 0,
      sales_day: salesDay ? salesDay : 0,
      sales_months: salesMonths,
      topProducts,
    })
  }
}

export default new ChartController();