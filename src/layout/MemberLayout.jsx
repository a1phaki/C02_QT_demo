import { useContext, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/userprovider";
import Footer from "../components/Footer";

const api_Path = 'https://web-project-api-zo40.onrender.com';

export default function MemberLayout() {

  const {user,updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
      const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
          "$1",
      );
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      loginCheck();
  }, []);

  const loginCheck = async()=>{
      try {
          const res = await axios.get(`${api_Path}/login/check`);
          const newUser = res.data.user;
          console.log(newUser)
          updateUser(newUser);
          
      } catch (error) {
          alert(error.response.data.message);
          navigate('/login');
      }
      
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/member/reservation">
                    預約
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/member/center">
                    會員中心
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
}