import { useEffect, useState } from "react";
import axios from "axios";
const api_Path = 'https://web-project-api-zo40.onrender.com';

export default function Orders(){

    const [orders,setOrders] = useState([]);

    const getOrders = async(page = 1,limit = 10)=>{
        try {
            const res = await axios.get(`${api_Path}/appointments?page=${page}&limit=${limit}`);
            console.log(res.data);
            setOrders(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getOrders()
    },[])

    return <>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col" width='15%'>預約訂單編號</th>
                    <th scope="col" width='10%'>姓名</th>
                    <th scope="col" width='15%'>電話</th>
                    <th scope="col" width='15%'>LINE ID</th>
                    <th scope="col" width='20%'>預約時段</th>
                    <th scope="col" width='8%'>是否卸甲</th>
                    <th scope="col" width='8%'>是否延甲</th>
                    <th scope="col" width='9%'>手部或足部</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order)=>(
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.name}</td>
                        <td>{order.phone}</td>
                        <td>{order.LineID}</td>
                        <td>{order.date}-{order.timeSlot}</td>
                        <td>{order.nailRemoval?'是':'否'}</td>
                        <td>{order.nailExtension?'是':'否'}</td>
                        <td>{order.bodyPart}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
}