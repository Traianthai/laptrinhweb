import { useEffect, useState } from "react";
import Loading from "./Loading";
const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);
    const handleLoginSubmit = (e) => {
        e.preventDefault()
        fetch("http://localhost:8080/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
            })
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/"
                    console.log("ok");
                    return response.text()
                }
                else {
                    alert("Sai tên hoặc mật khẩu !")
                    return response.text()
                }
            })
            .then(data => {
                localStorage.setItem("token", data)
            })
            .catch(error => console.error(error))
    }
    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8080/api/auth/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password,
                "roles": "USER"
            })
        })
            .then(response => {
                if (response.ok) {

                    if (window.confirm("Đăng kí thành công ! Đăng nhập ngay ?")) {
                        setLogin(!login);
                    }
                    return response.text()
                }
                else {
                    alert("Tên tài khoản hoặc email đã được sử dụng !")
                    return response.text()
                }
            })
            .then(data => {
                localStorage.setItem("token", data)
            })
            .catch(error => console.error(error))
    }
    const [active, setActive] = useState("");
    localStorage.removeItem("token");
    return (

        <>

            {loading ? (<Loading />) : (
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
                        </div>
                    </nav>
                    <div className="wrapper wrapper1">
                        <div className="container main">
                            <div className="row row1">
                                <div className="col-md-6 side-image" style={{ background: `url("images/pic/login-img.jpg")` }}>
                                    {/* <img src="images\background1.jpg" alt=""/> */}
                                    <div className="text1">
                                        <p>Lựa sách mà đọc cũng như lựa bạn mà chơi. Hãy coi chừng bạn giả <i>- Damiron</i></p>
                                    </div>
                                </div>
                                {login ? (
                                    <form className="col-md-6 right" onSubmit={handleRegisterSubmit}>
                                        <span className="icon-close" onClick={() => window.location = "/"}>
                                            <ion-icon name="close"></ion-icon>
                                        </span>
                                        <div className="input-box">
                                            <header className="h2" style={{
                                                fontSize: '2em',
                                                paddingBottom: '1em',
                                                fontWeight: '600',
                                                color: '#162938'
                                            }}>Đăng kí tài khoản</header>
                                            <div className="input-field">
                                                <input type="text" className="input" id="username" style={{ color: 'black' }} required autoComplete="off"
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    value={username} />
                                                <label htmlFor="username">Tên đăng nhập</label>
                                            </div>
                                            <div className="input-field">
                                                <input type="text" className="input" id="email" style={{ color: 'black' }} required autoComplete="off"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    value={email} />
                                                <label htmlFor="email">Email</label>
                                            </div>
                                            <div className="input-field">
                                                <input type="password" className="input" style={{ color: 'black' }} id="password" autoComplete="off" required
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password} />
                                                <label htmlFor="password">Mật khẩu</label>
                                            </div>
                                            <div className="input-field">
                                                <input type="submit" className="submit" value="Đăng kí" />
                                            </div>
                                            <div className="signin">
                                                <span>Đã có tài khoản ? <a href="#" onClick={() => { setLogin(!login) }}> Đăng nhập</a></span>
                                            </div>
                                        </div>
                                    </form>) : (<form className="col-md-6 right" onSubmit={handleLoginSubmit}>
                                        <span className="icon-close" onClick={() => window.location = "/"}>
                                            <ion-icon name="close"></ion-icon>
                                        </span>
                                        <div className="input-box">
                                            <header className="h2" style={{
                                                fontSize: '2em',
                                                fontWeight: '600',
                                                color: '#162938'
                                            }}>Đăng nhập</header>
                                            <div className="input-field">
                                                <input type="text" className="input" id="username" style={{ color: 'black' }} required autoComplete="off"
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    value={username} />
                                                <label htmlFor="username">Tên đăng nhập</label>
                                            </div>
                                            <div className="input-field">
                                                <input type="password" className="input" style={{ color: 'black' }} id="password" autoComplete="off" required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)} />
                                                <label htmlFor="password">Mật khẩu</label>
                                            </div>
                                            <div className="input-field">
                                                <input type="submit" className="submit" value="Đăng nhập" />
                                            </div>
                                            <div className="signin">
                                                <span>Chưa có tài khoản ?<a href="#" onClick={() => { setLogin(!login); setUsername(''); setPassword(''); setEmail('') }}> Đăng kí</a></span>
                                            </div>
                                        </div>
                                    </form>)}
                            </div>
                        </div>
                    </div>
                </>)}
        </>
    )
}
export default Login;

