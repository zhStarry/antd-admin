import { request } from "../utils/myRequest";


export default {
    loginApi: data => request.post('/user/login', data),
    logoutApi: params => request.get("/user/logout", params),
    registerApi: data => request.post("/user/register", data),
    tokenRefreshApi: params => request.get("/user/token-refresh", params),
    userInfoApi: params => request.get("/user/user-info", params),
}
