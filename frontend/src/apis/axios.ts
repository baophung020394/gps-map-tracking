import axios, { AxiosResponse } from 'axios'

const axiosClient = axios.create({
  // baseURL: 'http://192.168.64.11:5005/api'
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://144.126.240.194:5006/api'
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default axiosClient
