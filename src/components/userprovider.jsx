import { createContext, useState } from "react";
import PropTypes from 'prop-types';

// 設定默認值
const defaultUser = {
    id: '',
    email: '',
    name: '',
    birthday: '',
    LineID: '',
    phone: '',
    user:'',
};

// 創建 UserContext
const UserContext = createContext(defaultUser);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(defaultUser);  // 使用 useState 設定初始狀態

    // 可以加入方法來更新 user 資料
    const updateUser = (newUser) => {
        setUser((prevUser) => ({ ...prevUser, ...newUser }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserProvider, UserContext };
