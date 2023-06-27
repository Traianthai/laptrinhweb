import { useEffect, useState } from "react"
import Loading from "../pages/Loading"
const token = localStorage.getItem("token")



const Profile = (props) => {
    const [customUser, setCustomUser] = useState(props.customUser);
    const [newPassword, setNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(true);
    const [save, setSave] = useState(false);
    const handleChange = (event) => {
        event.preventDefault();

        const { name, value } = event.target;
        setCustomUser(prevData => ({ ...prevData, [name]: value }));
        // console.log(customUser);
        // console.log(props.customUser);
        setSave(true);
        // if(JSON.stringify(customUser) === JSON.stringify(props.customUser)){
        //     setSave(false);
        // }else{
        //     setSave(true);
        // }
    }
    console.log(customUser);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(customUser);
        setLoading(true);
        fetch("http://localhost:8080/api/auth/" + `${customUser.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "user": customUser })
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/"
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
    return (
        <>
            {loading ? (<Loading />) : (
                
                <form onSubmit={handleSubmit}>
                    <div className="container mt-5"
                        style={{
                            background: '#9dacb8',
                            borderRadius: '20px',
                            padding: '1em',
                            maxWidth: '600px'
                        }}>
                        <div className="mb-3 row justify-content-center">
                            <h2>Thông tin khách hàng</h2>
                        </div>
                        <div id="cnt" className="">
                            <div className="col thumbnail">
                                <div className="row justify-content-between">
                                    <div className="mb-2 col">
                                        <label htmlFor="firstName" className="form-label">Họ</label>
                                        <input type="text" className="form-control" name="firstName" value={customUser.firstName} onChange={handleChange} readOnly={edit} required/>
                                    </div>
                                </div>
                                <div className="row justify-content-between">
                                    <div className="mb-2 col">
                                        <label htmlFor="lastName" className="form-label">Tên</label>
                                        <input type="text" className="form-control" name="lastName" value={customUser.lastName} readOnly={edit} onChange={handleChange} required/>
                                    </div>
                                </div>
                                <div className="row justify-content-between">
                                    <div className="mb-2 col">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="text" className="form-control" name="email" value={customUser.email} readOnly onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row justify-content-between">
                                    <div className="mb-2 col">
                                        <label htmlFor="phone" className="form-label">Số Điện Thoại</label>
                                        <input type="text" className="form-control" name="phone" value={customUser.phone} readOnly={edit} onChange={handleChange} required/>
                                    </div>
                                </div>
                                <div className="row justify-content-between">
                                    <div className="mb-2 col">
                                        <label htmlFor="date" className="form-label">Ngày sinh</label>
                                        <input type="date" className="form-control" name="date" value={customUser.date} readOnly={edit} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row justify-content-between">
                                    <div className="mb-2 col">
                                        <label htmlFor="address" className="form-label">Địa chỉ</label>
                                        <textarea style={{ resize: 'none' }} name="address" value={customUser.address} onChange={handleChange} required className="form-control" rows="3" readOnly={edit}></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 row justify-content-around">
                            {edit ? (
                                <>
                                    <button className="btn  btn-secondary" onClick={() => setEdit(false)}>Sửa</button>
                                </>
                            ) : (
                                <>
                                    {save ? (
                                        <input className="btn btn-info" type="submit" value="Lưu" />
                                    ) : (<></>)}
                                    <button className="btn btn-secondary" onClick={() => { setEdit(true); setCustomUser(props.customUser);}}>Trở lại</button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </>
    )
}
export default Profile;