import { request } from "../utils/myRequest";


export default {
    addSocialSecurityApi: data => request.post('/socialSecurity/addSocialSecurity', data), // 单条新增
    deleteSocialSecurityApi: id => request.delete(`/socialSecurity/deleteSocialSecurity/${id}`), // 删除单条
    socialSecurityPageApi: data => request.post("/socialSecurity/socialSecurityPage", data), // 社保分页
    updateSocialSecurityApi: data => request.put(`/socialSecurity/updateSocialSecurity`, data), // 社保更新
    detailSocialSecurityApi: id => request.get(`/socialSecurity/detailSocialSecurity/${id}`), // 单条详情
    
}