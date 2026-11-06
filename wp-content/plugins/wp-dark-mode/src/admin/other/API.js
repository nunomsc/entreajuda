import axios from 'axios';

const API = {
    // Instance.
    get instance() {
        return axios.create({
            baseURL: wp_dark_mode_admin_json.rest_url || '/wp-json/wp-dark-mode/',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': wp_dark_mode_admin_json.rest_security_key || '',
            },
            credentials: 'same-origin',
        })

    },

    get: async (url, data = {}) => {
        return await API.instance.get(url, data)
    },

    post: async (url, data = {}) => {
        return await API.instance.post(url, data)
    },

    delete: async (url, data = {}) => {
        return await API.instance.delete(url, data)
    },

    put: async (url, data = {}) => {
        return await API.instance.put(url, data)
    },
}

export default API;