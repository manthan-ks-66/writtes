// antd notification context provider:

import { notification } from "antd";
import { createContext, useContext } from "react";

const NotificationContext = createContext(null);

export const useNotify = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={{ api }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
