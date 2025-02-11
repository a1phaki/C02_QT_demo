import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { UserContext } from "../components/userprovider";
import { useNavigate } from "react-router-dom";

const api_Path = 'https://web-project-api-zo40.onrender.com';

export default function Reservation(){

    const { register, handleSubmit, setValue ,formState:{errors}} = useForm();

    const [reservedTimeSlots, setReservedTimeSlots] = useState([]);

    const {user} = useContext(UserContext);

    const [events, setEvents] = useState([]);

    const [selectEventID,setSelectEventID] = useState('');

    const navigate = useNavigate();

    const getScheduleConfig = async()=>{
        try {
            const res = await axios.get(`${api_Path}/scheduleConfig`);
            const config = res.data[0];
            setReservedTimeSlots(config.reservedTimeSlots || []);
            generateCalendarEvents(config);
        } catch (error) {
            console.log(error);
        }
    }

    const generateCalendarEvents = (config) => {
        const fixedSlots = [
          { title: "10:30～14:30", start: "10:30:00", end: "14:30:00" },
          { title: "14:30～18:30", start: "14:30:00", end: "18:30:00" },
          { title: "18:30～22:30", start: "18:30:00", end: "22:30:00" },
        ];
        let slots = [];
        const today = new Date();
        const endDate = new Date(config.lastBookableDate);
        while (today <= endDate) {
             const dateStr = today.toISOString().split("T")[0];

            // 跳過不可用日期
            if (config.unavailableTimeSlots.includes(dateStr)) {
                today.setDate(today.getDate() + 1);
                continue;
            }

          // 檢查固定時間段是否已預約
            fixedSlots.forEach((slot) => {
                const isReserved = config.reservedTimeSlots.some(
                    (reserved) => reserved.date === dateStr && reserved.timeSlot === slot.title
                );

                // 跳過已預約的時段
                if (!isReserved) {
                    slots.push({
                        title: slot.title,
                        start: `${dateStr}T${slot.start}`,
                        end: `${dateStr}T${slot.end}`,
                        className: 'slot-available', // 可用時段樣式
                        id: `${dateStr}-${slot.title}`
                            .replace(/[:～]/g, '0') // 替換 : 和 ～ 為 0
                            .replace(/-/g, '1')    // 替換 - 為 1
                    });
                }
            });
            today.setDate(today.getDate() + 1);
        }
        setEvents(slots);
      };

      const handleEventClick = (info) => {
  setValue("timeSlot", `${info.event.startStr.split("T")[0]}，${info.event.title}`);

  // 移除先前選中的事件的樣式
  if (selectEventID) {
    const prevEvent = info.view.calendar.getEventById(selectEventID);
    if (prevEvent) {
      prevEvent.setProp('classNames', prevEvent.classNames.filter(cls => cls !== 'slot-selected') );
      prevEvent.setProp('classNames', [...prevEvent.classNames, 'slot-available']);
    }
  }

  // 為當前點擊的事件添加樣式
  info.event.setProp('classNames', info.event.classNames.filter(cls => cls !== 'slot-available'));
  info.event.setProp('classNames', [...info.event.classNames, 'slot-selected']);

  // 更新選中的事件 ID
  setSelectEventID(info.event.id);
};

      


      const onSubmit = async(data) =>{
        console.log(user,data);
        const [date, slot] = data.timeSlot.split("，");
        reservedTimeSlots.push({
            date:date,
            timeSlot: slot
        })
        const reservationData = {
            name: user.name,
            birthday: user.birthday,
            email: user.email,
            phone: user.phone,
            LineID: user.LineID,
            date: date,  // 從 timeSlot 中獲得的日期
            timeSlot: slot,  // 從 timeSlot 中獲得的時間段
            bodyPart: data.bodyPart,  // 從表單中獲得的值
            nailRemoval: data.nailRemoval,  // 從表單中獲得的值
            nailExtension: data.nailExtension  // 從表單中獲得的值
        };
        console.log(reservedTimeSlots);
        try {
            const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 隨機延遲
            // 使用 Promise.all 和 async/await 並行處理多個請求
            await new Promise(resolve => setTimeout(resolve, randomDelay)); // 模擬延遲
    
            const [postResponse, patchResponse] = await Promise.all([
                axios.post(`${api_Path}/appointments`, reservationData),
                axios.patch(`${api_Path}/scheduleConfig`,
                    { reservedTimeSlots: reservedTimeSlots }
                )
            ]);
    
            alert('預約成功');
            alert(`${reservationData.name} 您已成功預約 ${reservationData.date} ${reservationData.timeSlot} 的服務`);
            navigate('/member/center')
        } catch (error) {
            console.error(error.response);
            alert(error.response.data.message);
        }

      }
    

    useEffect(()=>{
        getScheduleConfig();
    },[])

    return <div className="container">
        <h3 className="text-center my-3">Reservation</h3>
        <div className="row">
            <div className="col-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-12 py-2">
                            <input type="text" {...register("timeSlot")} readOnly placeholder="請選擇日期與時間" className="w-100" />
                        </div>
                        <div className="col-12 py-2">
                            <select {...register("bodyPart")} className="w-100">
                                <option value="foot">足部</option>
                                <option value="hand">手部</option>
                            </select>
                        </div>
                        <div className="col-12 py-2">
                            <select {...register("nailRemoval")} className="w-100">
                            <option value="true">卸甲</option>
                            <option value="false">否</option>
                        </select>
                        </div>
                        <div className="col-12 py-2">
                            <select {...register("nailExtension")} className="w-100">
                                <option value="true">延甲</option>
                                <option value="false">否</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-100 my-2">送出預約</button>
                </form>
            </div>
            <div className="col-10">
                <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={events} eventClick={handleEventClick} />
            </div>
        </div>
    </div>
}