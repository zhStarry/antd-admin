import { request } from "../utils/myRequest";


export default {
    grossMarginAdminApi: data => request.post('/grossMargin/grossMarginAdmin', data), // 利润统计集合
    profitsListApi: () => request.get(`/grossMargin/profitsList`), // 每月利润
    turnoverListApi: () => request.get("/grossMargin/turnoverList"), // 每月营业额可视化
    turnoverYearListApi: () => request.get(`/grossMargin/turnoverYearList`), // 年营业额
    yearProfitsListApi: () => request.get(`/grossMargin/yearProfitsList`), // 年利润
}