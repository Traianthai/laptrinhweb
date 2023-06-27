import { useState, useEffect } from "react";

import ListBook from "../components/ListBook";
import Profile from "../components/Profile";
import Admin from "../components/Admin";
import Loading from "./Loading";
import Cart from "../components/Cart";

export const Logout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất ?")) {
        localStorage.removeItem("token")
        window.location = "/";
    }
}
const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [customUser, setCustomUser] = useState([]);
    const [list, setList] = useState(true);
    const [admin, setAdmin] = useState(false);
    const [info, setInfo] = useState(false);
    const [cart, setCart] = useState(false);
    const token = localStorage.getItem("token");


    useEffect(() => {
            fetch("http://localhost:8080/api/auth/info", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.json();
                    }
                })
                .then((data) => {
                    if (data === null) {
                        localStorage.removeItem("token")
                    }
                    setCustomUser(data);
                    // console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                    // localStorage.removeItem("token");
                    // alert("Vui lòng đăng nhập để sử dụng websies!");
                    // window.location = "/login";
                });
        }, [])
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    }
    return (
        <>

            <nav className="navbar fixed-top navbar-expand-lg" style={{
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div className="container" style={{

                }}>
                    <a className="navbar-brand mb-0 h2" style={{
                        fontSize: '2em',
                        color: '#fff',
                        userSelect: 'none'
                    }}>
                        Nhà Sách Trí Tuệ
                    </a>

                    <button className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation" style={{ color: '#fff', fontSize: '2em', }}>

                        <ion-icon name="list-outline"></ion-icon>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                        <ul className="navbar-nav">
                            <li className="nav-item active" style={{ color: '#fff', fontSize: '1.3em', paddingLeft: '15px' }}>
                                <div className="form-inline my-2 my-lg-0">
                                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={handleSearch} />
                                </div>
                            </li>
                            <li className="nav-item active" style={{ color: '#fff', fontSize: '1.3em', paddingLeft: '15px' }}>
                                <a className="nav-link" onClick={() => { setList(true); setAdmin(false); setInfo(false); setCart(false) }}>Trang chủ</a>
                            </li>
                            {
                                token ? (
                                    <>{customUser.roles === 'ADMIN' ? (
                                        <li className="nav-item" style={{ color: '#fff', fontSize: '1.3em', paddingLeft: '15px' }}>
                                            <a className="nav-link" onClick={() => { setList(false); setAdmin(true); setInfo(false); setCart(false) }}>Quản lí</a>
                                        </li>
                                    ) : (
                                        <>
                                            <li className="nav-item" style={{ color: '#fff', fontSize: '1.3em', paddingLeft: '15px' }}>
                                                <a className="nav-link" onClick={() => { setList(false); setAdmin(false); setInfo(true); setCart(false) }}>Thông tin cá nhân</a>
                                            </li>
                                            <li className="nav-item" style={{ color: '#fff', fontSize: '1.3em', paddingLeft: '15px' }}>
                                                <a className="nav-link" onClick={() => { setList(false); setAdmin(false); setInfo(false); setCart(true) }}>Giỏ Hàng</a>
                                            </li>
                                        </>
                                    )}
                                        <li className="nav-item" style={{ color: '#fff', fontSize: '1.3em', paddingLeft: '15px' }}>
                                            <a className="nav-link" onClick={() => { Logout() }}>Đăng Xuất</a>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item" style={{ color: '#fff', fontSize: '1.3em', paddingLeft: '15px' }}>
                                        <a className="nav-link" onClick={() => { window.location = "/login" }}>Đăng Nhập</a>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="wrapper overflow-auto" style={{
                padding: '4rem 0 3rem',
                position: 'relative',
                // width: '95vw',
                height: '100vh',
                // background: 'transparent',
                // border: '2px solid rgba(255, 255, 255, .5)',
                // borderRadius: '20px',
                // backdropFilter: 'blur(20px)',
                // boxShadow: '0 0 30px rgba(0, 0, 0, .5)',
                // overflow: 'hidden',
                // overflowY: 'scroll'
            }}>
                {list && <ListBook searchQuery={searchQuery} />}
                {info && <Profile customUser={customUser} />}
                {admin && <Admin />}
                {cart && <Cart />}
            </div >
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <div className="col-md-4 d-flex align-items-center">
                        <a href="https://getbootstrap.com/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                            
                        </a>
                        <span className="mb-3 mb-md-0" style={{color:"#fff"}}>© 2023 PTIT, manhzxcv</span>
                    </div>

                    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                        <li className="mr-2"><a style={{color:"#fff",fontSize:"30px"}} href="https://www.facebook.com/manhzxcv2.0"><ion-icon name="logo-facebook"></ion-icon></a></li>
                        <li className="mr-2"><a style={{color:"#fff",fontSize:"30px"}} href="https://github.com/Traianthai"><ion-icon name="logo-github"></ion-icon></a></li>
                    </ul>
                </footer>
        </>
    )
}
export default Home;