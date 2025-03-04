import { request } from "../utils/myRequest";


export default {
    addWageApi: data => request.post('/wage/addWage', data), // 单条新增
    deleteWageApi: id => request.delete(`/wage/deleteWage/${id}`), // 删除单条
    wagePageApi: data => request.post("/wage/wagePage", data), // 薪资分页
    updateWageApi: data => request.put(`/wage/updateWage`, data), // 薪资更新
    detailWageApi: id => request.get(`/wage/detailWage/${id}`), // 单条详情
    
}