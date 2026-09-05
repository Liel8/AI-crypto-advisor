import Axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api/'

const axios = Axios.create({
  withCredentials: true
})

export const httpService = {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data)
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data)
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data)
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data)
  }
}

async function ajax(endpoint, method = 'GET', data = null) {
  try {
    const loggedinUser = JSON.parse(sessionStorage.getItem('loggedinUser') || 'null')
    const headers = {}

    if (loggedinUser?.token) {
      headers.Authorization = `Bearer ${loggedinUser.token}`
    }

    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: method === 'GET' ? data : null,
      headers
    })

    return res.data
  } catch (err) {
    console.error(`HTTP Service error on ${method} ${endpoint}:`, err)

    if (err.response?.status === 401) {
      sessionStorage.clear()
    }

    throw err
  }
}