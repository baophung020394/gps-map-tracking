import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:5005/api'
})

// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `MOA ${token}`
//     }
//     return config
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error)
//   }
// )

// axiosClient.interceptors.response.use(
//   function (response: AxiosResponse) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response
//   },
//   function (error) {
//     return Promise.reject(error)
//   }
// )

export default axiosClient
