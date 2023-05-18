const express = require('express');
const uudi = require('uuid');
const app = express()
const port = 3000;
app.use(express.json())

const orders = [] 

const checkOrdersId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(user => user.id == id)

    request.orderId = id
    request.orderIndex = index
    
    if(index < 0){
        return response.status(404).json({error: "order not found"})
    }
    next()
}
const chackRequest = (request, response, next) => {
    const method = request.method
    const url = request.url
    console.log(`{${method}} - ${url}`)
    next()
}

app.post('/order', chackRequest, (request, response) => {
    const { order, clientName, price} = request.body
    let status = "Em preparação" 
    const user = {id:uudi.v4(), order, clientName, price, status}
    orders.push(user)

    return response.status(201).json(user)
});

app.get('/order', chackRequest, (request, response)=> {
    return response.status(200).json(orders)
});

app.put('/order/:id', chackRequest, checkOrdersId, (request, response) => {
    const id  = request.orderId
    const index = request.orderIndex
    const {order, clientName, price} = request.body
    const status = orders[index].status

    const updataOrder = {id, order, clientName, price, status}
    orders[index] = updataOrder
    
    return response.json(updataOrder);
});

app.delete('/order/:id', chackRequest, checkOrdersId, (request, response) => {
    const index = request.orderIndex
    orders.splice(index,1)

    return response.status(204).json()
});

app.get('/order/:id', chackRequest, checkOrdersId, (request, response) => {
    const index = request.orderIndex
    const order = orders[index]

    return response.status(200).json(order)
})

app.patch('/order/:id', chackRequest, checkOrdersId, (request, response) => {
    const index = request.orderIndex
    orders[index].status = "Pronto"
    const concluded = orders[index]

    return response.json(concluded)
})

app.listen(port, () => console.log(`🚀 Server stared on port ${port}`))