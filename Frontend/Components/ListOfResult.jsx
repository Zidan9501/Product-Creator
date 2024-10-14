import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ListOfResult.css";

function ListOfResult() {
  const [result, setResult] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleDelete = (e) => {
    console.log(e.target.name);
    if (confirm("Are you sure you want to delete this information?")) {
      console.log("Deleted information");
      fetch(`http://localhost:3000/${e.target.name}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          setResult(result.filter((item) => item.ProductID !== e.target.name));
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.log("Delete request canceled.");
    }
  };

  return (
    <div className="results">
      <h1 className="title_results">Results</h1>
      <section className="section_all_results">
        {result.map((item, index) => (
          <section key={index} className="section_individual_result">
            <article>
              <p className="p_results">Product Name</p>
              <p className="product_result">{item.ProductName}</p>
              <p className="p_results">Supplier ID</p>
              <p className="product_result">{item.SupplierID}</p>
              <p className="p_results">Category ID</p>
              <p className="product_result">{item.CategoryID}</p>
              <p className="p_results">Unit</p>
              <p className="product_result">{item.Unit}</p>
              <p className="p_results">Price</p>
              <p className="product_result">{item.Price}</p>
            </article>
            <div className="div_buttons_results">
              <Link to={`/modify/${item.ProductID}`}>
                <button className="modify_results">Modify</button>
              </Link>
              <button
                name={item.ProductID}
                onClick={handleDelete}
                className="delete_results">
                Delete
              </button>
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}

export default ListOfResult;
