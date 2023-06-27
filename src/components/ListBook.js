
import { useEffect } from "react";
import Loading from "../pages/Loading";
import { useState } from "react";
import ViewBook from "./child/ViewBook";



const ListBook = (props) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idbook, setIdbook] = useState();
    const [listbook, setListbook] = useState(true);
    const [viewbook, setViewbook] = useState(false);
    const [matchingBook, setMatchingBook] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8080/api/book/list")
            .then((response) => response.json())
            .then((data) => { setBooks(data); setLoading(false); setMatchingBook(data) })
            .catch((err) => { console.log(err); setLoading(false) });
    }, []);
    useEffect(() => {
        const matchingBook = books.filter(book => (book.bookName.toLowerCase().includes(props.searchQuery.toLowerCase()) || book.bookAuthor.toLowerCase().includes(props.searchQuery.toLowerCase())));
        setMatchingBook(matchingBook);
    }, [props.searchQuery]);

    return (
        <>
            {loading ? (<Loading />) : (<>
                {listbook && (<>
                    <section className="section-products">
                        <div className="container">

                            <div className="row">
                                {matchingBook.map((book) => (
                                    <div className="col-md-6 col-lg-4 col-xl-3" key={book.bookID}>
                                        <div id="product-1" className="single-product" >
                                            <div className="part-1 img-fluid" style={{
                                                background: `url("images/${book.bookImage}") no-repeat center`,
                                                // background: `url("http://localhost:8080/images/${book.bookImage}") no-repeat center`,
                                                backgroundSize: 'cover',
                                            }}>
                                                <ul>
                                                    <li><a onClick={() => { setIdbook(book.bookID); setListbook(!listbook); setViewbook(!viewbook) }} ><ion-icon name="bag-handle-outline"></ion-icon></a></li>
                                                    {/* <li><a ><ion-icon name="bag-handle-outline"></ion-icon></a></li> */}
                                                </ul>
                                            </div>
                                            <div className="part-2">
                                                <h3 className="product-title">{`${book.bookName}`+" - "+`${book.bookAuthor}`}</h3>
                                                <h4 className="product-old-price">{"$" + book.price * 3 / 2}</h4>
                                                <h4 className="product-price">{"$" + book.price}</h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                </>)}
                {viewbook && <ViewBook idbook={idbook} setViewbook={setViewbook} setListbook={setListbook} />}
            </>)}

        </>
    )
}
export default ListBook;