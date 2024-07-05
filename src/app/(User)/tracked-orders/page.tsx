"use client";

import React, { useState, useEffect } from 'react';
import OrderCards from './order-cards';
import SelectedOrderForm from './tracked-order-form';
import { fetchOrder, OrderData, OrderDetail, fetchOrderDetail } from '@/dbutils/userAPI/order';

const TrackedOrderForm: React.FC = () => {
    const [orderData, setOrderData] = useState<OrderData[]>([]);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchOrder();
                console.log('Fetched order data:', data);
                setOrderData(data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleItemClick = async (orderId: number) => {
        try {
            const orderDetail = await fetchOrderDetail(orderId);
            console.log('Fetched order detail:', orderDetail);
            setSelectedOrderDetail(orderDetail);
        } catch (error) {
            console.error("Error fetching order data:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 flex flex-col lg:flex-row lg:space-x-4 p-4">
            {orderData.length === 0 ? (
                <div className="flex flex-col h-full mt-10 lg:mt-28 mr-5 lg:mr-28">
                    <div className="mb-10 flex flex-col items-center justify-center w-full font-nunito text-slate-600">
                        <section className="max-w-full lg:max-w-[968px] w-full mx-4 flex items-center justify-center">
                            <p className="text-xl lg:text-2xl font-semibold text-gray-700">
                                You don&apos;t have an order yet
                            </p>
                        </section>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-1/3">
                        <p className="text-xl text-center font-semibold mb-4">Your Orders:</p>
                        <OrderCards orderData={orderData} onItemClick={handleItemClick} />
                    </div>
                    <div className="flex-1 p-4">
                        <SelectedOrderForm selectedOrderDetail={selectedOrderDetail} />
                    </div>
                </>
            )}
        </div>
    );
};

export default TrackedOrderForm;
