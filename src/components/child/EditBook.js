import { useEffect } from "react";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import Loading from "../../pages/Loading";
const token = localStorage.getItem("token");
const EditBook = (props) => {
    const [book, setBook] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(true);
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'category') {
            setBook(prevData => ({ ...prevData, [name]: JSON.parse(value) }));
        } else {
            setBook(prevData => ({ ...prevData, [name]: value }));
        }
    }

    // http://localhost:8080
    // 192.168.1.32

    useEffect(() => {
        fetch(`http://localhost:8080/api/book/${props.idbook}`)
            .then((response) => response.json())
            .then((data) => { setBook(data); setLoading(false) })
            .catch((err) => console.log(err));
        fetch("http://localhost:8080/api/category/list")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((err) => console.log(err));
        if (props.idbook < 0) setEdit(false);
    }, []);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        setEdit(false);
        fetch("http://localhost:8080/api/book/image", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
            .then((response) => response.text())
            .then((data) => {
                console.log(data)
                setBook(prevData => ({ ...prevData, ['bookImage']: data }));
            })
            .catch((err) => console.log(err));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch("http://localhost:8080/api/book/" + `${props.idbook}`, {
            method: props.idbook < 0 ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "book": book })
        })
            .then(response => {
                setLoading(false);
                if (response.ok) {
                    props.setViewbook(false);
                    props.setListbook(true);
                    props.setAddbook(false);
                    alert("Cập nhật thành công")
                    return response.text();
                } else {
                    alert("Sách thêm đã tồn tại")
                    return response.text()
                }
            })
            .then(data => {
                console.log(data)
                if (data !== '') {
                    alert(data)
                }
            })
            .catch(error => console.error(error));
    }
    return (
        <>  {loading ? (<Loading />) : (
            <form onSubmit={handleSubmit}>
                <div className="container"
                    style={{
                        background: '#9dacb8',
                        borderRadius: '20px',
                        padding: '1em'
                    }}
                >
                    <div className="mb-3 row justify-content-center">
                        <h3>Sách</h3>
                    </div>
                    <div id="cnt" className="row">
                        <div className="col thumbnail">
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label htmlFor="bookName" className="form-label">Tên sách</label>
                                    <input type="text" name="bookName" className="form-control" value={book.bookName} readOnly={edit} onChange={handleChange} required />
                                </div>
                                <div className="mb-2 col">
                                    <label htmlFor="bookAuthor" className="form-label">Tác giả</label>
                                    <input type="text" name="bookAuthor" className="form-control" value={book.bookAuthor} readOnly={edit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label htmlFor="bookDescribe" className="form-label">Miêu tả</label>
                                    <textarea style={{ resize: 'none' }} name="bookDescribe" value={book.bookDescribe} className="form-control" onChange={handleChange} rows="3" readOnly={edit}></textarea>
                                </div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label htmlFor="publisher" className="form-label">Nhà xuất bản</label>
                                    <input type="text" name="publisher" value={book.publisher} className="form-control" readOnly={edit} onChange={handleChange} required />
                                </div>
                                <div className="mb-2 col">
                                    <label htmlFor="price" className="form-label">Giá</label>
                                    <input type="number" name="price" value={book.price} className="form-control" readOnly={edit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label htmlFor="bookDate" className="form-label">Ngày phát hành</label>
                                    <input type="date" name="bookDate" value={book.bookDate} className="form-control" readOnly={edit} onChange={handleChange} required />
                                </div>
                                <div className="mb-2 col">
                                    <label htmlFor="pageNumber" className="form-label">Số trang</label>
                                    <input type="number" name="pageNumber" value={book.pageNumber} className="form-control" readOnly={edit} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="mb-2 col">
                                    <label htmlFor="categoryName" className="form-label">Thể loại</label>
                                    {edit ? (
                                        <input type="text" value={book.category.categoryName} className="form-control" readOnly />
                                    ) : (
                                        <select className="form-control" name="category" onChange={handleChange} value={book.category} required>
                                            {props.idbook < 0 ? (<>
                                                <option value={book.category}>{
                                                    book.category ? book.category.categoryName : ''
                                                }</option>
                                                {categories.map((category) => (
                                                    <option key={category.categoryID} value={JSON.stringify(category)}>{category.categoryName}</option>
                                                ))}
                                            </>) : (<>
                                                <option value={book.category}>{
                                                    book.category ? book.category.categoryName : ''
                                                }</option>

                                                {categories.map((category) => (
                                                    category.categoryID === book.category.categoryID ? (
                                                        <></>
                                                    ) : (
                                                        <option value={JSON.stringify(category)}>{category.categoryName}</option>
                                                    )
                                                ))}
                                            </>)}
                                        </select>
                                    )}
                                </div>
                                <div className="mb-2 col"></div>
                            </div>
                        </div>
                        <div className="col mb-2 ">
                            <div className="row justify-content-center">
                                <label htmlFor="upload" className="btn btn-info">Tải ảnh</label>
                                <input type="file" id="upload" className="d-none" onChange={handleImageUpload} />
                            </div>
                            <div className="row justify-content-center">
                                <img src={"images/" + `${book.bookImage}`} className="img-fluid thumbnail rounded mx-auto d-block"/>
                                {/* <img src = {"http://localhost:8080/images/"+`${book.bookImage}`} className="img-book"/> */}
                            </div>
                        </div>

                    </div>
                    <div className="mb-3 row justify-content-around">
                        {
                            edit ? (
                                <a className="btn btn-secondary" onClick={() => { setEdit(false) }}>Chỉnh sửa</a>) : (
                                <button className="btn btn-secondary" type="submit">Lưu</button>)
                        }
                        <a className="btn btn-secondary" onClick={() => {
                            props.setViewbook(false);
                            props.setListbook(true);
                            props.setAddbook(false);
                        }}>Trở lại</a>
                    </div>
                </div>

            </form>)}

        </>
    )
}
export default EditBook;