import axios from 'axios';

// Cria uma "instância" pré-configurada do Axios
const api = axios.create({
    // Define o URL base para todos os pedidos
    // Assim, em vez de axios.post('http://localhost:5000/api/auth/login', ...)
    // podemos simplesmente fazer api.post('/auth/login', ...)
    baseURL: 'http://localhost:5000/api',
});

export default api;