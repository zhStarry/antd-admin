import { request } from "../utils/myRequest";


export default {
    addTurnoverApi: data => request.post('/turnover/addTurnover', data), // 单条新增
    deleteTurnoverApi: id => request.delete(`/turnover/deleteTurnover/${id}`), // 删除单条
    turnoverPageApi: data => request.post("/turnover/turnoverPage", data), // 薪资分页
    updateTurnoverApi: data => request.put(`/turnover/updateTurnover`, data), // 薪资更新
    detailTurnoverApi: id => request.get(`/turnover/detailTurnover/${id}`), // 单条详情
    
}