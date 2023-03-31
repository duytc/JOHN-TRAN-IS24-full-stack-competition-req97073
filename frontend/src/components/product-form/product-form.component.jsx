import React, { useState } from 'react';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';

const ProductForm = ({products}) => {
      
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();  

  const [product, setProduct] = useState(products && products.find((p) => p.id === parseInt(id)) || null);
  
  const options = [
    { value: 'Alice', label: 'Alice' },
    { value: 'Bob', label: 'Bob' },
    { value: 'Charlie', label: 'Charlie' },
    { value: 'Dave', label: 'Dave' },
    { value: 'Eve', label: 'Eve' }
  ];

  if (product) {
    product.developers = options.filter((option) => product.developers.includes(option.value));
    console.log('product', product);    
  }
  
  
  const [name, setName] = useState(product ? product.name : '');
  const [ownerName, setOwnerName] = useState(product ? product.ownerName : '');
  const [developers, setDevelopers] = useState(product ? product.developers : []);
  const [scrumMasterName, setScrumMasterName] = useState(product ? product.scrumMasterName : '');
  const [startDate, setStartDate] = useState(product ? product.startDate : '');
  const [methodology, setMethodology] = useState(product ? product.methodology : '');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      ownerName,
      developers: developers.map((developer) => developer.value),
      scrumMasterName,
      startDate,
      methodology,
    };

    
    if (product) {
      // Update existing product
      fetch(`http://localhost/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Product updated:', data);
          setShowModal(true);
        })
        .catch((error) => {
          console.error('Error updating product:', error);
        });
    } else {
      // Create new product
      fetch('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Product created:', data);
        setShowModal(true);
        // Reset form values
        setName('');
        setOwnerName('');
        setDevelopers([]);
        setScrumMasterName('');
        setStartDate('');
        setMethodology('');
      })
      .catch((error) => {
        console.error('Error creating product:', error);
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit} className="product-form w-90">
      <div className="mb-3  row">
        <label htmlFor="name" className="col-sm-4 col-form-label text-end">Project Name:</label>
        <div className="col-sm-8">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="mb-3 row">
  <label htmlFor="ownerName" className="col-sm-4 col-form-label text-end">Owner Name:</label>
    <div className="col-sm-8">
      <input
        type="text"
        id="ownerName"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        className="form-control"
        required
      />
    </div>
</div>

<div className="mb-3 row">
  <label htmlFor="developers" className="col-sm-4 col-form-label text-end">Developers:</label>
  <div className="col-sm-8">
    <Select
      id="developers"
      options={options}
      value={developers}
      onChange={(selectedOptions) => setDevelopers(selectedOptions)}
      isMulti
      closeMenuOnSelect={false}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  </div>
</div>

<div className="mb-3 row">
  <label htmlFor="scrumMasterName" className="col-sm-4 col-form-label text-end">Scrum Master Name:</label>
  <div className="col-sm-8">
    <input
      type="text"
      id="scrumMasterName"
      value={scrumMasterName}
      onChange={(e) => setScrumMasterName(e.target.value)}
      className="form-control"
      required
    />
  </div>
</div>

<div className="mb-3 row">
  <label htmlFor="startDate" className="col-sm-4 col-form-label text-end">Start Date:</label>
  <div className="col-sm-8">
    <input
      type="date"
      id="startDate"  
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="form-control"
      required
      />
      
      
        </div>
      </div>
      <div className="mb-3 row">
        <label htmlFor="methodology" className="col-sm-4 col-form-label text-end">Methodology:</label>
        <div className="col-sm-8">
          <select
            id="methodology"
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="form-control"
            required
          >
            <option value="">--Select Methodology--</option>
            <option value="Scrum">Scrum</option>
            <option value="Kanban">Kanban</option>
            <option value="XP">XP</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary w-25">Submit</button>
      </div>

      </form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Submitted successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false); 
            navigate('/products');
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      </div>
        );
      };
export default ProductForm;