import { Op } from "sequelize";
import Request from "../models/Request";

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

    const salesMonth = await Request.count({
      where: {
        [Op.and]: [
          {createdAt: { [Op.gte]: `${month}-1-${year}`}},
          {createdAt: { [Op.lt]: `${month == 12 ? "1" : Number(month) + 1}-1-${month == 12 ? Number(year) + 1 : year}`}},
        ],
      }
    })

    const salesDay = await Request.count({
      where: {
        [Op.and]: [
          {createdAt: { [Op.gte]: today}},
        ],
      }
    })

    return response.status(200).json({
      value_month: valueMonth ? valueMonth : 0,
      sales_month: salesMonth ? salesMonth : 0,
      sales_day: salesDay ? salesDay : 0,
    })
  }
}

export default new ChartController();