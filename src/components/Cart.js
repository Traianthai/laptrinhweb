
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../pages/Loading";
const token = localStorage.getItem("token");

const Rate = (props) => {
    const [order, setOder] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch("http://localhost:8080/api/order/" + `${props.orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
        })
            .then(response =>
                response.json()
            )
            .then(data => {
                setOder(data);
                setLoading(false);
            })
            .catch(error => console.error(error));
    }, [])
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'comment') {
            setOder(prevData => ({ ...prevData, [name]: value }));
        }
        if (name === "rating") {
            setOder(prevData => ({ ...prevData, ['start']: parseInt(value) }));
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch("http://localhost:8080/api/order/rate/" + `${props.orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "orderRate": order })
        })
            .then(response => {
                if (response.ok) {
                    setLoading(false);
                    alert("Cảm ơn bạn đã nhận xét !");
                    props.setView(!props.view);
                    props.setSubmit(!props.submit);
                    // props.setViewbook(false);
                    // props.setListbook(true);
                    return response.text();
                } else {
                    alert("Đánh giá chưa được lưu !");
                    return response.text()
                }
            })
            .then(data => {
                setLoading(false);
            })
            .catch(error => console.error(error));
    }
    return (<> {loading ? (<Loading />) : (
        <>
            <form onSubmit={handleSubmit}>
                <div className="container mt-5"
                    style={{
                        background: '#9dacb8',
                        borderRadius: '20px',
                        padding: '1em'
                    }}
                >
                    <div className="mb-3 row justify-content-center">
                        <h3>Đánh giá</h3>
                    </div>
                    <div id="cnt" className="">
                        <div className="col thumbnail">
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label htmlFor="comment" className="form-label">Nhận xét</label>
                                    <textarea style={{ resize: 'none' }} name="comment" value={order.comment} onChange={handleChange} className="form-control" rows="3"></textarea>
                                </div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label className="form-label">Đánh giá</label>
                                </div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <div className="rating">
                                        <input type="radio" id="star5" name="rating" value="5" checked={"5" == order.start} onChange={handleChange} />
                                        <label htmlFor="star5"></label>
                                        <input type="radio" id="star4" name="rating" value="4" checked={"4" == order.start} onChange={handleChange} />
                                        <label htmlFor="star4"></label>
                                        <input type="radio" id="star3" name="rating" value="3" checked={"3" == order.start} onChange={handleChange} />
                                        <label htmlFor="star3"></label>
                                        <input type="radio" id="star2" name="rating" value="2" checked={"2" == order.start} onChange={handleChange} />
                                        <label htmlFor="star2"></label>
                                        <input type="radio" id="star1" name="rating" value="1" checked={"1" == order.start} onChange={handleChange} />
                                        <label htmlFor="star1"></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-3 row justify-content-around">
                    <button className="btn btn-secondary" type="submit">Gửi</button>
                    <a className="btn btn-secondary" onClick={() => { props.setView(!props.view) }} >Trở lại</a>
                </div>
            </form>
        </>
    )}</>)
}
const Oder = (props) => {
    const [loading, setLoading] = useState(false);
    const [order, setOder] = useState([]);
    const doDelete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn hủy đơn hàng ?")) {
            setLoading(true);
            fetch("http://localhost:8080/api/order/" + `${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        setLoading(false);
                        props.setSubmit(!props.submit);
                        return response.text();
                    } else {
                        return response.text()
                    }
                })
                .then((data) => {

                })
                .catch((err) => console.log(err));
        }
    }
    const doStatus = (id) => {
        if (window.confirm("Bạn chắc chắn đã nhận được hàng ?")) {
            setLoading(true);
            fetch("http://localhost:8080/api/order/" + `${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.ok) {
                        setLoading(false);
                        props.setSubmit(!props.submit);
                        return response.text();
                    } else {
                        return response.text()
                    }
                })
                .then((data) => {

                })
                .catch((err) => console.log(err));
        }
    }
    var stt = 0;
    return (
        <> {loading ? (<Loading />) : (
            <>{<section className="table__body">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col"> #</th>
                            <th scope="col"> Tên Sách </th>
                            <th scope="col"> Ngày đặt </th>
                            <th scope="col"> Số lượng </th>
                            <th scope="col"> Thanh Toán</th>
                            <th scope="col"> Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.orders.map((order) => (
                            order.status === props.status ? (<>{(
                                <tr key={order.orderId}>
                                    <th scope="row">{stt += 1}</th>
                                    <td>{order.orderBook.bookName}</td>
                                    <td>{order.orderDate}</td>
                                    <td> <strong>{order.bookNumber} </strong></td>
                                    <td style={{ color: "red" }}>{`${order.bookNumber * order.orderBook.price}$`}</td>
                                    <td>
                                        {props.status === 0 ? (<button className="btn btn-danger" onClick={() => { doDelete(order.orderId) }}>Hủy</button>) : (<></>)}
                                        {/* <button className="status view">View</button> */}
                                        {props.status === 1 ? (<button className="btn btn-success" onClick={() => { doStatus(order.orderId) }}>Đã nhận được hàng</button>) : (<></>)}
                                        {props.status === 2 ? (<button className="btn btn-secondary" onClick={() => { props.setView(!props.view); props.setOderId(order.orderId) }}>Đánh giá</button>) : (<></>)}
                                        {/* {props.status === 2 && order.start !==0 ?(<>{"Đánh giá: "+`${order.start}`+"/5"}</>) : (<></>)} */}
                                    </td>
                                </tr>
                            )}</>) : (<> </>)
                        ))}
                    </tbody>
                </table>
            </section>}</>
        )}</>
    )
}

const Cart = () => {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState(0);
    const [oder, setOder] = useState(true);
    const [view, setView] = useState(false);
    const [orderId, setOderId] = useState();
    const [loading, setLoading] = useState(true);
    const [submit, setSubmit] = useState(true);
    useEffect(() => {
        fetch("http://localhost:8080/api/order/list-user", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data != null) setOrders(data);
                setLoading(false)
            })
            .catch((err) => console.log(err));

    }, [submit]);
    return (
        <> {loading ? (<Loading />) : (<>
            <div className="container-fluid mt-5 overflow-auto" style={{
                background: '#9dacb8',
                borderRadius: '20px',
                padding: '1em',
                maxWidth: '90%',
                minHeight: '90%',
                maxHeight: '90%'
            }}>
                <div className="row">
                    <div className="col-3 thumbnail">
                        <div className="row p-2" style={{
                            position: 'sticky',
                            top: '0',
                            left: '0',
                        }}>
                            <div className="col-10 align-self-center">
                                <button className={`btn w-100 ${status == 0 ? "btn-primary" : "btn-light"}`} onClick={() => { setStatus(0) }}>Chờ xử lý</button>
                            </div>
                        </div>
                        <div className="row p-2" style={{
                            position: 'sticky',
                            top: '0',
                            left: '0',
                        }}>
                            <div className="col-10 align-self-center">
                                <button className={`btn w-100 ${status == 1 ? "btn-primary" : "btn-light"}`} onClick={() => { setStatus(1) }}>Đang giao</button>
                            </div>
                        </div>
                        <div className="row p-2" style={{
                            position: 'sticky',
                            top: '0',
                            left: '0',
                        }}>
                            <div className="col-10 align-self-center">
                                <button className={`btn w-100 ${status == 2 ? "btn-primary" : "btn-light"}`} onClick={() => { setStatus(2) }}>Lịch sử</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 thumbnail">
                        {!view && <Oder
                            orders={orders}
                            status={status}
                            setSubmit={setSubmit}
                            submit={submit}
                            setView={setView}
                            view={view}
                            setOderId={setOderId}

                        />}
                        {view && <Rate
                            orderId={orderId}
                            setView={setView}
                            setSubmit={setSubmit}
                            submit={submit}
                            view={view} />}
                    </div>
                </div>
            </div></>)}
        </>

    )
}
export default Cart;