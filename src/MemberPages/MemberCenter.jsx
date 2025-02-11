import { Outlet, Link } from "react-router-dom";

const MemberProfile = () => {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-primary ">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/member/center/data">
                    會員資料
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/member/center/orders">
                    訂單明細
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div>
        <Outlet /> 
      </div>
    </div>
  );
};

export default MemberProfile;

