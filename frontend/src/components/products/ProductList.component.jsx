
import { useNavigate } from 'react-router-dom';


import './ProductList.style.css';

const ProductList = (props) => { 

    const { products, handleDelete } = props;
    const navigate = useNavigate();

  
    const onEditClick = (productId) => {
      console.log("Edit this product", productId);
      const product = products.find((p) => p.id === productId);
      navigate(`/products/${productId}`, { product });
      
    };
  
    const onDeleteClick = async (productId) => {
      console.log('Delete product with id: ', productId);  
      await handleDelete(productId);
    };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Owner Name</th>
          <th>Developers</th>
          <th>Scrum Master</th>
          <th>Start Date</th>
          <th>Methodology</th>
          <td colSpan="2" style={{textAlign: 'center'}}>Actions</td>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.ownerName}</td>
            <td>{product.developers ? product.developers.join(', ') : ''}</td>           
            <td>{product.scrumMasterName}</td>
            <td>{product.startDate}</td>
            <td>{product.methodology}</td>
            <td>
              <button className="btn edit-btn" onClick={() => onEditClick(product.id)}>Edit</button>
            </td>
            <td>
              <button className="btn delete-btn" onClick={() => onDeleteClick(product.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductList;
