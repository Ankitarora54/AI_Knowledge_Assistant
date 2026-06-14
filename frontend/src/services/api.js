
import axios from "axios";

let activeSelection = {
  repository: "",
  file: ""
};

let resultListener = null;
let loadingListener = null;
let activeRequests = 0;

const apiBaseUrl =
  (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api"
  ).replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  if (config.method !== "get") {
    activeRequests += 1;
    loadingListener?.(true);

    config.data = {
      ...(config.data || {}),
      repository: activeSelection.repository || undefined,
      file: activeSelection.file || undefined
    };
  }

  return config;
});

api.interceptors.response.use((response) => {
  if (response.config.method !== "get" && resultListener) {
    resultListener(response.data);
  }

  if (response.config.method !== "get") {
    activeRequests = Math.max(0, activeRequests - 1);
    loadingListener?.(activeRequests > 0);
  }

  return response;
}, (error) => {
  if (error.config?.method !== "get") {
    activeRequests = Math.max(0, activeRequests - 1);
    loadingListener?.(activeRequests > 0);
  }

  return Promise.reject(error);
});

export function setApiSelection(selection) {
  activeSelection = {
    repository: selection.repository || "",
    file: selection.file || ""
  };
}

export function subscribeToApiResults(listener) {
  resultListener = listener;

  return () => {
    if (resultListener === listener) {
      resultListener = null;
    }
  };
}

export function subscribeToApiLoading(listener) {
  loadingListener = listener;

  return () => {
    if (loadingListener === listener) {
      loadingListener = null;
    }
  };
}

export default api;
