import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { addNotification } from "../../../Redux/Notifications/action";
import NotificationCard from "./NotificationCard";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const Notification = ({ type }) => {
  const dispatch = useDispatch();
  const { auth, notification } = useSelector((store) => store);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS("http://localhost:5000/api/notifications/ws");
    const stomp = Stomp.over(sock);
    setStompClient(stomp);
  }, []);

  useEffect(() => {
    if (stompClient) {
      stompClient.connect(
        {},
        () => {
          if (true) {
            stompClient.subscribe(
              `/notification/user/${auth.user?.id}`,
              onMessageRecive,
              (error) => console.error("Subscription error:", error)
            );
          }
        },
        (error) => console.error("WebSocket error:", error)
      );
    }
  }, [stompClient]);

  const onMessageRecive = (payload) => {
    const receivedNotification = JSON.parse(payload.body);
    dispatch(addNotification(receivedNotification));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <NotificationsNoneOutlinedIcon sx={{ color: "#6366f1", fontSize: 20 }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 text-sm">
              {notification.notifications.filter((n) => !n.isRead).length} unread
            </p>
          </div>
        </div>
      </div>

      {notification.notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <NotificationsNoneOutlinedIcon sx={{ color: "#94a3b8", fontSize: 32 }} />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">All caught up!</h3>
          <p className="text-slate-400 text-sm">No notifications to show right now</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notification.notifications.map((item) => (
            <NotificationCard type={type} key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;