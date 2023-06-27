import { useEffect } from "react";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import Loading from "../../pages/Loading";
const token = localStorage.getItem("token");
const ViewProfile = (props) => {
    const [user, setUser] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(true);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevData => ({ ...prevData, [name]: value }));
    }

    // http://localhost:8080
    // 192.168.1.32

    useEffect(() => {
        fetch(`http://localhost:8080/api/auth/${props.iduser}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => { setUser(data); setLoading(false) })
            .catch((err) => console.log(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (window.confirm("Bạn có chắc chắn muốn sửa thông tin của khách hàng ?")) {
            setLoading(true);
            fetch("http://localhost:8080/api/auth/" + `${props.iduser}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ "user": user })
            })
                .then(response => {
                    if (response.ok) {
                        props.setListuser(true);
                        props.setViewuser(false);
                        return response.text()
                    }
                    else {
                        return response.text()
                    }
                })
                .then(data => {
                    console.log(data);
                    setLoading(false);
                    if (data !== '') {
                        alert(data)
                    }
                    else {
                        alert("Cập nhật thành công!!!")
                    }

                })
                .catch(error => console.error(error))
        }
    }
    return (
        <>  {loading ? (<Loading />) : (
            <form onSubmit={handleSubmit}>
                <div className="container" style={{
                    background: '#9dacb8',
                    borderRadius: '20px',
                    padding: '1em',
                    border: '1px solid #f0f0f0',
                    maxWidth: '600px'
                }}>
                    <div className="mb-3 row justify-content-center">
                        <h2>Thông tin khách hàng</h2>
                    </div>
                    <div id="cnt" className="">
                        <div className="col thumbnail">
                            <div className="mb-2 row">
                                <label htmlFor="firstName" className="col-sm-3 col-form-label">Họ</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" name="firstName" value={user.firstName} readOnly={edit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-2 row">
                                <label htmlFor="lastName" className="col-sm-3 col-form-label">Tên</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" name="lastName" value={user.lastName} readOnly={edit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-2 row">
                                <label htmlFor="address" className="col-sm-3 col-form-label">Địa chỉ</label>
                                <div className="col-sm-9">
                                    <textarea type="text" style={{ resize: 'none' }} className="form-control" name="address" rows="3" value={user.address} readOnly={edit} onChange={handleChange} ></textarea>
                                </div>
                            </div>
                            <div className="mb-2 row">
                                <label htmlFor="phone" className="col-sm-3 col-form-label">Điện thoại</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" name="phone" value={user.phone} readOnly={edit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-2 row">
                                <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" name="email" value={user.email} readOnly={edit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-2 row">
                                <label htmlFor="date" className="col-sm-3 col-form-label">Ngày sinh</label>
                                <div className="col-sm-9">
                                    <input type="date" className="form-control" name="date" value={user.date} readOnly={edit} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-2 row">
                                <label htmlFor="roles" className="col-sm-3 col-form-label">Quyền</label>
                                <div className="col-sm-9">
                                    <input type="text" className="form-control" name="roles" value={user.roles} readOnly onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="mb-3 row pt-3" style={{
                }}>
                    <div className="col d-flex justify-content-end">
                        {
                            edit ? (
                                <a className="btn btn-secondary" onClick={() => { setEdit(false) }}>Chỉnh sửa</a>) : (
                                <button className="btn btn-secondary" type="submit" >Lưu</button>)
                        }
                    </div>
                    <div className="col d-flex justify-content-start">
                        <a className="btn btn-secondary" onClick={() => {
                            props.setListuser(true);
                            props.setViewuser(false);
                        }}>Trở lại</a>
                    </div>
                </div>
            </form>)}

        </>
    )
}
export default ViewProfile;