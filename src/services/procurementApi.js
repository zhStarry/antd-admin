import { request } from "../utils/myRequest";


export default {
    procurementMonthPageApi: data => request.post('/procurement/procurementMonthPage', data), // 分页
    addProcurementApi: data => request.post("/procurement/addProcurement", data), // 新增单条
    addProcurementMonthApi: data => request.post("/procurement/addProcurementMonth", data), // 按月新增
    procurementDeleteApi: id => request.delete(`/procurement/procurementDelete/${id}`),
    procurementMonthDeleteApi: id => request.delete(`/procurement/procurementMonthDelete/${id}`),
    procurementMonthDetailApi: id => request.get(`/procurement/procurementMonthDetail/${id}`),
    procurementUpdateApi: data => request.put(`/procurement/procurementUpdate`, data),
    updateProcurementMonthApi: data => request.put(`/procurement/updateProcurementMonth`, data),
    procurementDetailApi: id => request.get(`/procurement/procurementDetail/${id}`)
}