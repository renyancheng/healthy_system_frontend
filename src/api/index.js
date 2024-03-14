import request from "./request";

export const get = (url, params) => request.get(url, { params });
export const post = (url, data) => request.post(url, data);
export const upload = (url, data) => request.post(url, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// 配置所有的接口
export const login = (username, password) =>
  post("/User/Login", { username, password });
export const register = (data) => post("/User/Register", data);
export const logout = () => post("/User/Logout");
export const getUserInfo = () => get("/User/GetUserInfo");
export const getUserProfile = (id) =>
  get("/User/GetUserProfile", { id });
export const updateUserProfile = (data) =>
  post("/User/UpdateProfile", data);
export const updateUserInfo = (data) => post("/User/UpdateInfo", data);
export const getDietDiary = (id) => get("/DietDiary/GetData", { id });
export const getDietDiaryList = (page) =>
  get("/DietDiary/GetList", { page, pageSize: 10 });
export const createDietDiary = (meals) =>
  post("/DietDiary/CreateData", { meals });
export const updateDietDiary = (id, meals) =>
  post("/DietDiary/UpdateData", { id, meals });
export const deleteDietDiary = (id) =>
  post("/DietDiary/DeleteData", { id });
export const getArticle = (id) => get("/Article/GetData", { id });
export const getArticleList = (page) =>
  get("/Article/GetList", { page, pageSize: 10 });
export const createArticle = (data) =>
  post("/Article/CreateData", data);
export const updateArticle = (data) =>
  post("/Article/UpdateData", data);
export const deleteArticle = (id) =>
  post("/Article/DeleteData", { id });
export const getArticleComment = (article_id, page, pageSize) =>
  get("/ArticleComment/GetList", { article_id, page, pageSize });
export const createArticleComment = (data) =>
  post("/ArticleComment/CreateData", data);
export const deleteArticleComment = (id) =>
  post("/ArticleComment/DeleteData", { id });
export const uploadImage = (data) =>
upload("/Upload/Index", data);
