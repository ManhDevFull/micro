import { updateAuth } from '@/redux/reducers/authReducer'
import store from '@/redux/store'
import axios from 'axios'
import queryString from 'query-string'

// const baseURL = 'http://localhost:5000'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const getAccessToken = () => {
  const res = localStorage.getItem('token')
  if (res) {
    const auth = JSON.parse(res)
    return auth && auth.token ? auth.token : ''
  }
  return ''
}
const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(async (config: any) => {
  const accessToken = getAccessToken()
  config.headers = {
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
    Accept: 'application/json',
    ...config.headers,
  }
  return { ...config, data: config.data ?? null }
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

axiosClient.interceptors.response.use(
  (res) => {
    if (res.data && res.status >= 200 && res.status < 300) {
      return res.data
    }
    return Promise.reject(res.data)
  },
  async (error) => {
    const originalRequest = error.config
    const { response } = error

    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return axiosClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/Auth/refresh-token`,
          {},
          { withCredentials: true }
        )

        const newToken = refreshResponse.data?.data?.accessToken
        if (newToken) {
        store.dispatch(updateAuth({token: newToken}))
          processQueue(null, newToken)

          originalRequest.headers['Authorization'] = 'Bearer ' + newToken
          return axiosClient(originalRequest)
        }
      } catch (err) {
        processQueue(err, null)
        localStorage.removeItem('token')
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(response?.data || error)
  }
)

export default axiosClient


