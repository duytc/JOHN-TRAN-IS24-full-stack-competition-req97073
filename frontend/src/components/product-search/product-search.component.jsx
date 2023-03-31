import React, { useState } from 'react';
import ProductList from '../products/ProductList.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import './product-search.style.css';

function SearchableProductList( { products }  ) {
  
  const [filterText, setFilterText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const navigate = useNavigate();
  
  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
    setFilteredProducts(products.filter((product) => {
      if (product.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        return true;
      }
      return false;
    }));
  };

  const handleAddProduct = () => {
    navigate('/products/new');      
  };
  
  const handleDelete = async (productId) => {
    console.log('Delete product with id: ', productId);  
  
    // Display confirmation dialog
    const confirmDelete = window.confirm(`Are you sure you want to delete the product id = ? ${productId}`);
  
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost/api/products/${productId}`, {
          method: 'DELETE',
        });
        const data = await response.json();      
        console.log('Product deleted:', data);
  
        // Remove deleted product from filteredProducts array
        setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
  
        // Display success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('success-message');
        successMessage.textContent = 'Product deleted successfully!';
        document.body.appendChild(successMessage);
  
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 1000);
  
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  
  return (
    
    <div className="table-container">

        <div className="col-12">        
          <input
            className="form-control form-control-lg search-box"
            type="text"
            placeholder="Search by product name..."
            value={filterText}
            onChange={handleFilterTextChange}
          />
        </div>

        <div className="col-12">
          <button className="btn add-product-btn" type="button" onClick={handleAddProduct}>Add Product</button>
        </div>

    <div className="row">
      <div className="col-xl-12">
        <ProductList products={filteredProducts} handleDelete={handleDelete} />
      </div>
    </div>

    </div>
);
}

export default SearchableProductList;
