import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const generatePlaybook = (data) =>
  api.post("/generate-playbook", data);

const register = (data) =>
  api.post("/register", data);

const login = (data) =>
  api.post("/login", data);

const savePlaybook = (data) =>
  api.post("/save-playbook", data);

const getSavedPlaybooks = (username) =>
  api.get(`/playbooks/${username}`);

const getPosts = () =>
  api.get("/posts");

const createPost = (data) =>
  api.post("/posts", data);

const upvotePost = (postId) =>
  api.post(`/posts/${postId}/upvote`);

const downloadPDF = (playbook) =>
  api.post(
    "/download-pdf",
    {
      playbook,
    },
    {
      responseType: "blob",
    }
  );

export {
  generatePlaybook,
  register,
  login,
  savePlaybook,
  getSavedPlaybooks,
  getPosts,
  createPost,
  upvotePost,
  downloadPDF,
};