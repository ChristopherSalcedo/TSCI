import { createContext, useState, useContext, useEffect } from 'react'
import { createOrderRequest, deleteOrderRequest, getOrderRequest, getOrdersRequest, testOrderRequest, updateOrderRequest, deleteTmpRequest } from '../api/orders'
import { authUser } from './authContext'

export const ordersContext = createContext()

export const useOrders = () => {
    const context = useContext(ordersContext)
    if (!context) throw new Error("Order Provider is missing");
    return context
}

export const OrderProvider = ({ children }) => {

    const [orders, setOrders] = useState([])
    const [user, setUser] = useState([])

    useEffect(() => {
        (async () => {
            const res = await getOrdersRequest()
            setOrders(res.data)
        })()

    }, [])

    authUser()

    const createOrder = async (order) => {
        // console.log("res: ", order)
        const res = await createOrderRequest(order)
        setOrders([...orders, res.data])
        return res
    }

    const getOrder = async (orderId) => {
        const res = await getOrderRequest(orderId)
        return res.data
    }

    const testOrder = async (testFiles) => {
        const res = await testOrderRequest(testFiles)
        return res
    }

    const deleteTmp = async (tmpId) => {
        await deleteTmpRequest(tmpId)
    }

    const updateOrder = async (orderId, order) => {
        const res = await updateOrderRequest(orderId, order)
        setOrders(orders.map((order) => (order._id === orderId ? res.data : order)))
    }

    const deleteOrder = async (orderId) => {
        await deleteOrderRequest(orderId)
        setOrders(orders.filter((order) => order._id !== orderId))
    }

    return <ordersContext.Provider value={{
        orders,
        authUser,
        setUser,
        user,
        createOrder,
        getOrder,
        updateOrder,
        deleteOrder,
        testOrder,
        deleteTmp
    }}>
        {children}
    </ordersContext.Provider>
}