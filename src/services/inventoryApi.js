import { request } from "../utils/myRequest";


export default {
    addInventoryApi: data => request.post('/inventory/addInventory', data), // 单条新增
    inventoryDeleteApi: id => request.delete(`/inventory/inventoryDelete/${id}`), // 删除单条
    inventoryMonthDeleteApi: id => request.delete(`/inventory/inventoryMonthDelete/${id}`), // 删除整月
    inventoryPageApi: data => request.post(`/inventory/inventoryPage`, data), // 月分页
    inventoryUpdateApi: data => request.put(`/inventory/inventoryUpdate`, data), // 单条库存更新
    addInventoryPageApi: data => request.post("/inventory/addInventoryPage", data), // 新增库存页
    inventoryMonthUpdateApi: data => request.put(`/inventory/inventoryMonthUpdate`, data), // 库存更新
    inventoryMonthDetailApi: id => request.get(`/inventory/inventoryMonthDetail/${id}`), // 月详情
    
}