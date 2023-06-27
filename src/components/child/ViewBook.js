import { useEffect } from "react";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import $ from "jquery";
import Loading from "../../pages/Loading";
const token = localStorage.getItem("token");
const ViewBook = (props) => {
    const [book, setBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buy, setBuy] = useState(true);
    const [order, setOrder] = useState([]);
    const [orderRate, setOrderRate] = useState([]);
    const [rate, setRate] = useState(false);
    const [idorder, setIdorder] = useState();
    const handleChange = (event) => {
        const { name, value } = event.target;
        setOrder(prevData => ({ ...prevData, [name]: value }));
        if (name === 'comment') {
            setOrderRate(prevData => ({ ...prevData, [name]: value }));
        }
        if (name === "rating") {
            setOrderRate(prevData => ({ ...prevData, ['start']: parseInt(value) }));
        }
    }

    // http://localhost:8080
    // 192.168.1.32

    useEffect(() => {
        fetch(`http://localhost:8080/api/book/${props.idbook}`)
            .then((response) => response.json())
            .then((data) => {
                setBook(data);
                setLoading(false);
                setOrder(prevData => ({ ...prevData, ['bookID']: props.idbook }));
            })
            .catch((err) => console.log(err));
    }, []);
    useEffect(() => {
        $(window).on("resize", function () {
            if ($(window).width() < 1024) {
                $("#cnt").addClass("col");
                $("#cnt").removeClass("row");
            } else {
                $("#cnt").addClass("row");
                $("#cnt").removeClass("col");
            }
        });
    }, []);
    if ($(window).width() < 1024) {
        $("#cnt").addClass("col");
        $("#cnt").removeClass("row");
    } else {
        $("#cnt").addClass("row");
        $("#cnt").removeClass("col");
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch("http://localhost:8080/api/order/new", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "order": order })
        })
            .then(response => {
                if (response.ok) {
                    setLoading(false);
                    alert("Đặt hàng thành công !");
                    setRate(true);
                    // props.setViewbook(false);
                    // props.setListbook(true);
                    return response.text();
                } else {
                    alert("Bạn chỉ có thể mua hàng với tư cách khách hàng!");
                    return response.text()
                }
            })
            .then(data => {
                setIdorder(data);
                setLoading(false);
            })
            .catch(error => console.error(error));
    }

    const doRate = (id) => {
        console.log(orderRate, id);
        setLoading(true);
        fetch("http://localhost:8080/api/order/rate/" + `${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "orderRate": orderRate })
        })
            .then(response => {
                setLoading(false);
                if (response.ok) {
                    alert("Cảm ơn bạn đã nhận xét !");
                    props.setViewbook(false);
                    props.setListbook(true);
                    return response.text();
                } else {
                    alert("Đánh giá chưa được lưu !");
                    window.location.href = "/";
                    props.setViewbook(false);
                    props.setListbook(true);
                    return response.text()
                }
            })
            .then(data => {
                setLoading(false);
            })
            .catch(error => console.error(error));
    }
    return (
        <>  {loading ? (<Loading />) : (
            <form onSubmit={handleSubmit}>
                <div className="container mt-5"
                    style={{
                        background: '#9dacb8',
                        borderRadius: '20px',
                        padding: '1em'
                    }}
                >
                    <div className="mb-3 row justify-content-center">
                        <h3>Sách</h3>
                    </div>
                    <div id="cnt" className="">
                        <div className="col thumbnail">
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label htmlFor="bookName" className="form-label">Tên</label>
                                    <input type="text" name="bookName" value={book.bookName} className="form-control" readOnly />
                                </div>
                                <div className="mb-2 col">
                                    <label htmlFor="bookAuthor" className="form-label">Tác giả</label>
                                    <input type="text" name="bookAuthor" value={book.bookAuthor} className="form-control" readOnly />
                                </div>
                            </div>
                            {rate ? (
                                <>

                                    <div className="row justify-content-between">
                                        <div className="mb-2 col">
                                            <label htmlFor="comment" className="form-label">Nhận xét</label>
                                            <textarea style={{ resize: 'none' }} name="comment" value={orderRate.comment} onChange={handleChange} className="form-control" rows="3"></textarea>
                                        </div>
                                    </div>
                                    <div className="row justify-content-between">
                                        <div className="mb-2 col">
                                            <label  className="form-label">Đánh giá</label>
                                        </div>
                                    </div>
                                    <div className="row justify-content-between">

                                        <div className="mb-2 col">
                                            <div className="rating">
                                                <input type="radio" id="star5" name="rating" value="5" onChange={handleChange} />
                                                <label htmlFor="star5"></label>
                                                <input type="radio" id="star4" name="rating" value="4" onChange={handleChange} />
                                                <label htmlFor="star4"></label>
                                                <input type="radio" id="star3" name="rating" value="3" onChange={handleChange} />
                                                <label htmlFor="star3"></label>
                                                <input type="radio" id="star2" name="rating" value="2" onChange={handleChange} />
                                                <label htmlFor="star2"></label>
                                                <input type="radio" id="star1" name="rating" value="1" onChange={handleChange} />
                                                <label htmlFor="star1"></label>
                                            </div>
                                        </div>
                                    </div>
                                </>) : (<>
                                    <div className="row justify-content-between">
                                        <div className="mb-2 col">
                                            <label htmlFor="bookDescribe" className="form-label">Miêu tả</label>
                                            <textarea style={{ resize: 'none' }} name="bookDescribe" value={book.bookDescribe} className="form-control" rows="3" readOnly></textarea>
                                        </div>
                                    </div>
                                    <div className="row justify-content-between">
                                        <div className="mb-2 col">
                                            <label htmlFor="publisher" className="form-label">Nhà xuất bản</label>
                                            <input type="text" name="publisher" value={book.publisher} className="form-control" readOnly />
                                        </div>
                                        <div className="mb-2 col">
                                            <label htmlFor="price" className="form-label">Giá</label>
                                            <input type="number" name="price" value={book.price} className="form-control" readOnly />
                                        </div>
                                    </div>
                                    <div className="row justify-content-between">
                                        <div className="mb-2 col">
                                            <label htmlFor="bookDate" className="form-label">Ngày phát hành</label>
                                            <input type="date" name="bookDate" value={book.bookDate} className="form-control" readOnly />
                                        </div>
                                        <div className="mb-2 col">
                                            <label htmlFor="pageNumber" className="form-label">Số trang</label>
                                            <input type="number" name="pageNumber" value={book.pageNumber} className="form-control" readOnly />
                                        </div>
                                    </div>
                                    <div className="row justify-content-between">
                                        <div className="mb-2 col">
                                            <label htmlFor="categoryName" className="form-label">Thể loại</label>
                                            <input type="text" value={book.category.categoryName} className="form-control" readOnly />
                                        </div>
                                        {buy ? (
                                            <div className="mb-2 col">
                                            </div>
                                        ) : (
                                            <div className="mb-2 col">
                                                <label htmlFor="bookNumber" className="form-label">Số Lượng</label>
                                                <input type="number" name="bookNumber" value={parseInt(order.bookNumber)} onChange={handleChange} className="form-control" required />
                                            </div>
                                        )}
                                    </div>

                                    {buy ? (<></>) : (
                                        <div className="row justify-content-between">
                                            <div className="mb-2 col">
                                                <label>Tổng Tiền</label>
                                                <input type="number" style={{ color: 'red' }} name="totalMoney" value={order.bookNumber * book.price} readOnly className="form-control" />
                                            </div>
                                            <div className="mb-2 col"></div>
                                        </div>
                                    )}
                                </>)}
                        </div>
                        <div className="col mb-2 ">
                            <img src={"images/" + `${book.bookImage}`} className="img-fluid thumbnail rounded mx-auto d-block" alt="Book" style={{ width: '80%', maxWidth: '400px', backgroundSize: 'cover', padding: '20px' }} />
                        </div>
                    </div>

                    <div className="mb-3 row justify-content-around">
                        {
                            buy ? (
                                <a type="button" className="btn btn-outline-secondary"
                                    onClick={() => {
                                        if (token) {
                                            setBuy(false);
                                        } else {
                                            if (window.confirm("Bạn phải đăng nhập để mua sách !")) {
                                                window.location = "/login";
                                            }
                                        }
                                    }}>Mua</a>) : (
                                rate ? (<>
                                    <a type="button" className="btn btn-outline-secondary" onClick={() => {
                                        doRate(idorder);
                                    }}
                                    >Gửi</a>
                                </>) : (
                                    <button className="btn btn-info" type="submit">Đặt Mua</button>)
                            )
                        }
                        <a type="button" className="btn btn-outline-secondary" onClick={() => {
                            props.setViewbook(false);
                            props.setListbook(true);
                        }}>Trở lại</a>
                    </div>
                </div>
            </form>
        )}

        </>
    )
}
export default ViewBook;