import { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const api_Path = 'https://web-project-api-zo40.onrender.com';

export default function AdminReservation() {
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [reservedTimeSlots, setReservedTimeSlots] = useState([]);
    const [lastBookableDate, setLastBookableDate] = useState("");

    // 取得預約設定 (不可用日期、已預約時段)
    const getScheduleConfig = async () => {
        try {
            const res = await axios.get(`${api_Path}/scheduleConfig`);
            const config = res.data[0];
            setLastBookableDate(config.lastBookableDate || getLastDayOfMonth());
            setUnavailableDates(config.unavailableTimeSlots || []);
            setReservedTimeSlots(config.reservedTimeSlots || []);
        } catch (error) {
            console.log(error);
        }
    };

    // 取得當月的最後一天
    const getLastDayOfMonth = () => {
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return lastDay.toISOString().split("T")[0];
    };

    // 生成月曆事件
    const generateEvents = () => {
        let events = [
            ...unavailableDates.map((date) => ({
                title: "躺平日",
                start: date,
                color: "red",
                allDay: true,
                extendedProps: { type: "unavailable" },
            })),
            ...reservedTimeSlots.map((slot) => ({
                title: slot.timeSlot,
                start: slot.date,
                color: "blue",
                allDay: true,
                extendedProps: { type: "reserved" },
            })),
        ];

        const startDate = new Date();
        const endDate = new Date(lastBookableDate);
        while (startDate <= endDate) {
            const dateStr = startDate.toISOString().split("T")[0];
            if (!unavailableDates.includes(dateStr) && !reservedTimeSlots.some(slot => slot.date === dateStr)) {
                events.push({
                    title: "可躺平",
                    start: dateStr,
                    color: "green",
                    allDay: true,
                    extendedProps: { type: "available" },
                });
            }
            startDate.setDate(startDate.getDate() + 1);
        }
        return events;
    };

    const handleEventClick = (info) => {
        const event = info.event;

        if (event.extendedProps.type === "available") {
            // 將可用事件顏色改為紅色，並修改標題為「躺平日」
            event.setProp("color", "red");
            event.setProp("title", "躺平日");
            event.setExtendedProp("type", "unavailable");

            // 更新 unavailableDates 狀態
            setUnavailableDates((prev) => [...prev, event.startStr]);
        } else if (event.extendedProps.type === "unavailable") {
            // 將不可用事件顏色改為綠色，並修改標題為「可躺平」
            event.setProp("color", "green");
            event.setProp("title", "可躺平");
            event.setExtendedProp("type", "available");

            // 更新 unavailableDates 狀態，刪除已選擇的日期
            setUnavailableDates((prev) => prev.filter((date) => date !== event.startStr));
        }
    };

    const handleUpdatelastBookableDate = async() =>{
      try {
        const res = await  axios.patch(`${api_Path}/scheduleConfig`,{ lastBookableDate: lastBookableDate })
        alert('開放預約日期已更新');
        getScheduleConfig();
      } catch (error) {
        alert(error.response.data.message);
      }
    } 

    const handleUpdateUnavailable = async() => {
      try {
        const res = await  axios.patch(`${api_Path}/scheduleConfig`,{ unavailableTimeSlots: unavailableDates })
        alert('躺平日已更新');
        getScheduleConfig();
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    // 在組件掛載時調用以獲取預約設定
    useEffect(() => {
        getScheduleConfig();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="inputs flex flex-col items-center">
                <label htmlFor="lastBookableDate">設定可預約的最後日期:</label>
                <input
                    type="date"
                    id="lastBookableDate"
                    value={lastBookableDate}
                    onChange={(e) => setLastBookableDate(e.target.value)}
                />
                <button className="btn btn-primary mx-4" onClick={handleUpdatelastBookableDate}>
                    確定開放預約日期
                </button>
                <button className="btn btn-outline-primary" onClick={handleUpdateUnavailable}>
                    更新躺平日
                </button>
            </div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={generateEvents()} // 動態生成事件
                eventClick={handleEventClick}
            />
        </div>
    );
}
