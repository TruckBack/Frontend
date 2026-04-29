import apiService from './api';
import type { Order, OrderCreate, OrderUpdate, OrderCancel, Page } from './types';

export const orderService = {
    createOrder(data: OrderCreate): Promise<Order> {
        return apiService.post('/orders', data).then(res => res.data);
    },

    listAvailableOrders(limit: number = 20, offset: number = 0): Promise<Page<Order>> {
        return apiService.get('/orders/available', { params: { limit, offset } }).then(res => res.data);
    },

    listOrderHistory(limit: number = 20, offset: number = 0): Promise<Page<Order>> {
        return apiService.get('/orders/history', { params: { limit, offset } }).then(res => res.data);
    },

    listMyActiveOrders(): Promise<Order[]> {
        return apiService.get('/orders/me/active').then(res => res.data);
    },

    getOrder(orderId: number): Promise<Order> {
        return apiService.get(`/orders/${orderId}`).then(res => res.data);
    },

    acceptOrder(orderId: number): Promise<Order> {
        return apiService.post(`/orders/${orderId}/accept`).then(res => res.data);
    },

    startOrder(orderId: number): Promise<Order> {
        return apiService.post(`/orders/${orderId}/start`).then(res => res.data);
    },

    pickupOrder(orderId: number): Promise<Order> {
        return apiService.post(`/orders/${orderId}/pickup`).then(res => res.data);
    },

    completeOrder(orderId: number): Promise<Order> {
        return apiService.post(`/orders/${orderId}/complete`).then(res => res.data);
    },

    cancelOrder(orderId: number, data: OrderCancel): Promise<Order> {
        return apiService.post(`/orders/${orderId}/cancel`, data).then(res => res.data);
    },

    updateOrder(orderId: number, data: OrderUpdate): Promise<Order> {
        return apiService.patch(`/orders/${orderId}`, data).then(res => res.data);
    },

    deleteOrder(orderId: number): Promise<void> {
        return apiService.delete(`/orders/${orderId}`).then(() => undefined);
    },
};
