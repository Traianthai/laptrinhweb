import { useEffect } from "react";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import Loading from "../../pages/Loading";
const token = localStorage.getItem("token");
const AddCategory = (props) => {
    const [category, setCategory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(true);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setCategory(prevData => ({ ...prevData, [name]: value }));
    }

    // http://localhost:8080
    // 192.168.1.32


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(category);
        setLoading(true);
        fetch("http://localhost:8080/api/category/" + `${-1}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "category": category })
        })
            .then(response => {
                setLoading(false);
                if (response.ok) {
                    alert("Thêm thành công!");
                    props.setAddcategory(false);
                    props.setListcategory(true);
                    props.setSubmit(!props.submit);
                    return response.text();
                } else {
                    alert("Thể loại đã tồn tại!");
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
            <form className="wrapper-book" onSubmit={handleSubmit}>
                <div className="container mt-5">
                    <div className="mb-3 row justify-content-center">
                        <h3>Thể loại</h3>
                    </div>
                    <div className="row justify-content-between">
                        <div className="mb-2 col">
                            <label htmlFor="bookName" className="form-label">Tên thể loại</label>
                            <input type="text" name="categoryName" className="form-control" value={category.categoryName} onChange={handleChange} required />
                        </div>
                        <div className="mb-2 col">
                        </div>
                    </div>
                    <div className="row justify-content-between">
                        <div className="mb-2 col d-flex justify-content-around">
                            <button className="btn btn-info" type="submit">Lưu</button>
                            <a className="btn btn-secondary" onClick={() => {
                                props.setAddcategory(false);
                                props.setListcategory(true);
                            }}>Trở lại</a>
                        </div>
                        <div className="mb-2 col">
                        </div>

                    </div>

                </div>

            </form>)}

        </>
    )
}
export default AddCategory;