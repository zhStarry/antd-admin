import { request } from "../utils/myRequest";


export default {
    addMaterialApi: data => request.post('/material/addMaterial', data), // 单条新增
    deleteMaterialApi: id => request.delete(`/material/deleteMaterial/${id}`), // 删除单条
    materialPageApi: data => request.post("/material/materialPage", data), // 原材料分页
    updateMaterialApi: data => request.put(`/material/updateMaterial`, data), // 原材料更新
    detailMaterialApi: id => request.get(`/material/detailMaterial/${id}`), // 单条详情
    materialListApi: () => request.get(`/material/materialList`), // 不分页
    
}