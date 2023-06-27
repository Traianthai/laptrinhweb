import { useEffect } from "react";
import { useState } from "react";
import Loading from "../pages/Loading";
import EditBook from "./child/EditBook";
import ViewProfile from "./child/ViewProfile";
import AddCategory from "./child/AddCategory";
const token = localStorage.getItem("token");
const BookManage = () => {
    const [books, setBooks] = useState([]);
    const [viewbook, setViewbook] = useState(false);
    const [addbook, setAddbook] = useState(false);
    const [idbook, setIdbook] = useState();
    const [loading, setLoading] = useState(true);
    const [listbook, setListbook] = useState(true);
    var stt = 0;
    useEffect(() => {
        fetch("http://localhost:8080/api/book/list")
            .then((response) => response.json())
            .then((data) => { setBooks(data); setLoading(false) })
            .catch((err) => console.log(err));
    }, [listbook]);

    const doDelete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xoá sách này?")) {
            fetch("http://localhost:8080/api/book/" + `${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
            })
                .then(response => {
                    if (response.ok) {
                        window.location = "/";
                        return response.text();
                    } else {
                        window.alert("Quyển sách này đang được mua, bạn không thể xóa!")
                        return response.text()
                    }
                })
                .then(data => { console.log(data) })
                .catch(error => console.error(error));
        }
    }
    return (
        <>  {loading ? (<Loading />) : (
            <>  {viewbook && <EditBook idbook={idbook} setViewbook={setViewbook} setListbook={setListbook} setAddbook={setAddbook} />}
                {addbook && <EditBook idbook={-1} setViewbook={setViewbook} setListbook={setListbook} setAddbook={setAddbook} />}
                {listbook && (<section className="table__body">
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-light w-100 mb-1" onClick={() => { setAddbook(true); setListbook(false) }}>Thêm</button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col"> Id </th>
                                <th scope="col"> Tên </th>
                                <th scope="col"> Tác giả </th>
                                <th scope="col"> Ngày phát hành </th>
                                <th scope="col"> Số trang</th>
                                <th scope="col"> Đã bán </th>
                                <th scope="col"> Nhà xuất bản </th>
                                <th scope="col"> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.bookID}>
                                    <th scope="row">{book.bookID}</th>
                                    <td>
                                        <div className="row">
                                            <div className="col">
                                                
                                                <img src={"images/" + `${book.bookImage}`} className="img-fluid thumbnail rounded mx-auto d-block" alt="Book" style={{ width: '40px', height:'40px',maxWidth: '90px', backgroundSize: 'cover', }} />
                                            </div>
                                            <div className="col"> {book.bookName}</div>
                                        </div>
                                    </td>
                                    <td> {book.bookAuthor} </td>
                                    <td>{book.bookDate}</td>
                                    <td>{book.pageNumber}</td>
                                    <td> <strong> {book.soldNumber} </strong></td>
                                    <td>{book.publisher}</td>
                                    <td className="d-flex">
                                        <button className="btn btn-secondary mr-1" onClick={() => { setIdbook(book.bookID); setViewbook(true); setListbook(false) }}>View</button>
                                        <button className="btn btn-danger" onClick={() => { doDelete(book.bookID) }}>Delete</button>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </section>)}
            </>)}
        </>
    )
}

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewuser, setViewuser] = useState(false);
    const [iduser, serIduser] = useState();
    const [listuser, setListuser] = useState(true);
    var stt = 0;
    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8080/api/auth/list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }
        )
            .then((response) => response.json())
            .then((data) => { setUsers(data); setLoading(false) })
            .catch((err) => console.log(err));
    }, [listuser]);
    const doDelete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xoá khách hàng này?")) {
            setLoading(true);
            fetch("http://localhost:8080/api/auth/" + `${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
            })
                .then(response => {
                    setLoading(false);
                    if (response.ok) {
                        window.location = "/";
                        return response.text();
                    } else {
                        window.alert("Tài khoản đang được sử dụng không thể xoá !")
                        return response.text()
                    }
                })
                .then(data => { console.log(data) })
                .catch(error => console.error(error));
        }
    }
    return (
        <>{loading ? (<Loading />) : (
            <>  {viewuser && <ViewProfile iduser={iduser} setListuser={setListuser} setViewuser={setViewuser} />}
                {listuser && <section className="table__body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col"> #</th>
                                <th scope="col"> Họ </th>
                                <th scope="col"> Tên</th>
                                <th scope="col"> Địa chỉ </th>
                                <th scope="col"> Ngày sinh </th>
                                <th scope="col"> Số điện thoại </th>
                                <th scope="col"> Email </th>
                                <th scope="col"> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <>  {user.roles === "ADMIN" ? (<></>) : (
                                    <tr key={user.userId}>
                                        <th scope="row">{stt += 1}</th>
                                        <td> {user.firstName}</td>
                                        <td> {user.lastName} </td>
                                        <td>{user.address}</td>
                                        <td>{user.date}</td>
                                        <td> <strong> {user.phone} </strong></td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button className="btn btn-secondary mr-1" onClick={() => { serIduser(user.userId); setListuser(false); setViewuser(true) }}>View</button>
                                            <button className="btn btn-danger" onClick={() => { doDelete(user.userId) }}>Delete</button>
                                        </td>
                                    </tr>
                                )}</>
                            ))}
                        </tbody>
                    </table>
                </section>}

            </>)}
        </>
    )
}

const OrderManage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listorder, setListorder] = useState(true);
    const [submit, setSubmit] = useState(true);
    var stt = 0;
    useEffect(() => {
        fetch("http://localhost:8080/api/order/list", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        }
        )
            .then((response) => response.json())
            .then((data) => { setOrders(data); setLoading(false) })
            .catch((err) => console.log(err));
    }, [submit]);
    const doStatus = (id) => {
        setLoading(true);
        fetch("http://localhost:8080/api/order/" + `${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    setLoading(false);
                    setSubmit(!submit);
                    return response.text();
                } else {
                    return response.text()
                }
            })
            .then((data) => {

            })
            .catch((err) => console.log(err));
    }

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
                        setSubmit(!submit);
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
    return (
        <>{loading ? (<Loading />) : (
            <>
                {listorder && <section className="table__body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col"> #</th>
                                <th scope="col"> username </th>
                                <th scope="col"> idbook </th>
                                <th scope="col"> Tên sách </th>
                                <th scope="col"> Ngày đặt </th>
                                <th scope="col"> số lượng </th>
                                <th scope="col"> Thanh Toán</th>
                                <th scope="col"> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <>  {(
                                    <tr key={order.userId}>
                                        <th scope="row">{stt += 1}</th>
                                        <td> {order.orderUser.username}</td>
                                        <td> {order.orderBook.bookID} </td>
                                        <td>{order.orderBook.bookName}</td>
                                        <td>{order.status}</td>
                                        <td> <strong> {order.bookNumber} </strong></td>
                                        <td style={{ color: "red" }}>{order.bookNumber * order.orderBook.price}</td>
                                        <td>
                                            {order.status === 0 ? (<button className="btn btn-success mr-1" onClick={() => { doStatus(order.orderId) }}>Giao Hàng</button>) : (<></>)}
                                            {order.status === 1 ? (<button className="btn btn-info">Đang Giao</button>) : (<></>)}
                                            {order.status === 0 ? (<button className="btn btn-danger" onClick={() => { doDelete(order.orderId) }}>Hủy</button>) : (<></>)}
                                            {order.status === 2 ? (<strong> Đã nhận được hàng</strong>) : (<></>)}
                                        </td>
                                    </tr>
                                )}</>
                            ))}

                        </tbody>
                    </table>
                </section>}

            </>)}
        </>
    )
}

const Category = () => {
    const [categorys, setCategorys] = useState([]);
    const [addcategory, setAddcategory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listcategory, setListcategory] = useState(true);
    const [submit, setSubmit] = useState(true);
    var stt = 0;
    useEffect(() => {
        fetch("http://localhost:8080/api/category/list")
            .then((response) => response.json())
            .then((data) => { setCategorys(data); setLoading(false) })
            .catch((err) => console.log(err));
    }, [submit]);
    const doDelete = (id) => {
        if (window.confirm("Bạn chắc chắn muốn xoá thể loại này ?")) {
            setLoading(true);
            fetch("http://localhost:8080/api/category/" + `${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
                .then((response) => {
                    setLoading(false);
                    setSubmit(!submit);
                    if (response.ok) {
                        alert("Xoá thành công");
                        return response.text();
                    } else {
                        alert("Xoá thất bại vì thể loại này vẫn còn sách");
                        return response.text()
                    }
                })
                .then((data) => {

                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <>  {loading ? (<Loading />) : (
            <>
                {addcategory && <AddCategory setAddcategory={setAddcategory} setListcategory={setListcategory} setSubmit={setSubmit} submit={submit} />}
                {listcategory && (
                    <section className="table__body">
                        <div className="d-flex justify-content-center ">
                            <button className="btn btn btn-light w-100 mb-1" onClick={() => { setAddcategory(true); setListcategory(false) }}>Thêm</button>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> # </th>
                                    <th scope="col"> Tên </th>
                                    <th scope="col"> Số lượng sách</th>
                                    <th scope="col"> Action </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorys.map((category) => (
                                    <tr key={category.categoryID}>
                                        <th scope="row">{stt += 1}</th>
                                        <td> {category.categoryName} </td>
                                        <td> <strong> {category.sumBook} </strong></td>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => { doDelete(category.categoryID) }}>Delete</button>
                                        </td>
                                    </tr>))}
                            </tbody>
                        </table>
                    </section>
                )}
            </>)}
        </>
    )
}

const Admin = () => {

    const [usermanage, setUsermanage] = useState(false);
    const [bookmanage, setBookmanage] = useState(true);
    const [ordermanage, setOrdermanage] = useState(false);
    const [category, setCategory] = useState(false);
    return (
        <>
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
                                <button type="button" className={`btn w-100 ${bookmanage ? "btn-primary" : "btn-light"}`} onClick={() => { setBookmanage(true); setOrdermanage(false); setUsermanage(false); setCategory(false) }}>Quản lý truyện</button>
                            </div>
                        </div>
                        <div className="row p-2" style={{
                            position: 'sticky',
                            top: '50px',
                            left: '0',
                        }}>
                            <div className="col-10 align-self-center">
                                <button type="button" className={`btn w-100 ${usermanage ? "btn-primary" : "btn-light"}`} onClick={() => { setBookmanage(false); setOrdermanage(false); setUsermanage(true); setCategory(false) }}>Quản lý khách hàng</button>
                            </div>
                        </div>
                        <div className="row p-2" style={{
                            position: 'sticky',
                            top: '100px',
                            left: '0',
                        }}>
                            <div className="col-10 align-self-center">
                                <button type="button" className={`btn w-100 ${ordermanage ? "btn-primary" : "btn-light"}`} onClick={() => { setBookmanage(false); setOrdermanage(true); setUsermanage(false); setCategory(false) }}>Quản lý đơn hàng</button>
                            </div>
                        </div>
                        <div className="row p-2" style={{
                            position: 'sticky',
                            top: '150px',
                            left: '0',
                        }}>
                            <div className="col-10 align-self-center">
                                <button type="button" className={`btn w-100 ${category ? "btn-primary" : "btn-light"}`} onClick={() => { setBookmanage(false); setOrdermanage(false); setUsermanage(false); setCategory(true) }}>Quản lý thể loại</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9 thumbnail">

                        {usermanage && <UserManage />}
                        {bookmanage && <BookManage />}
                        {ordermanage && <OrderManage />}
                        {category && <Category />}

                    </div>
                </div>
            </div >
        </>
    )
}
export default Admin;