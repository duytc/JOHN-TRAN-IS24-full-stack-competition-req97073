import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductForm from './components/product-form/product-form.component';

import SearchableProductList from './components/product-search/product-search.component';

function App() {
  
  const [loadedProducts, setloadedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        setloadedProducts(data.products);        
        console.log(data.products);      
          
      } catch (error) {
        setError('Failed to fetch data');
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
  
    <div>
        <h1> Application Management System </h1>

        <div className='main-section'>          
            <Routes>            
              <Route path ='/' element={!isLoading && <SearchableProductList products={loadedProducts} />} />   
              <Route path ='/products' element={!isLoading && <SearchableProductList products={loadedProducts} />} />        
              <Route path = '/products/new' element={<ProductForm />} />        
              <Route path='/products/:id' element={<ProductForm products={loadedProducts} />} />
            </Routes>

        </div>
        
    </div>
    
  )
 
}

export default App;
