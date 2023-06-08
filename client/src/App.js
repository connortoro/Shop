import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';


function App() {

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [page, setPage] = useState('products')

  useEffect(() => {
    fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data => {
        console.log("products: " + data.products[0]._id)
        setProducts(data.products)
    })
    .catch(err => {
        console.log(err)
    })
  }, [])

  const addToCart = (product) => {
    setCart([...cart, {...product}])
  }

  const removeFromCart = (productToRemove) => {
    setCart(cart.filter((product) => {
      return (product !== productToRemove)
    }))
  }

  const checkout = () => {
    for(let i = 0; i < cart.length; i++) {
      fetch('http://localhost:3000/orders', {
        method: 'POST',
        body: `{product: ${cart[i]._id}}`
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
    }
  }

  const renderProducts = () => {
    return (
      <>
        <h1>Products</h1>
        <div className='products'>
          {products.map(product => {
            return (
              <div className='product' key={product._id}>
                <h2>{product.name}</h2>
                <h3>{product.price}</h3>
                <img src={product.productImage} alt={product.name}></img>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const renderCart = () => {
    return(
      <>
        <h1>Cart</h1>
        <div className='products'>
          {cart.map(product => {
            return (
              <div className='product' key={product._id}>
                <h2>{product.name}</h2>
                <h3>{product.price}</h3>
                <img src={product.productImage} alt={product.name}></img>
                <button onClick={() => removeFromCart(product)}>Remove</button>
              </div>
            )
          })}
          <button className='checkout' onClick={checkout}>Checkout</button>
        </div>
      </>
    )
  }

  const navigateTo = (nextPage) => {
    setPage(nextPage)
  }

  return (
    <div className='App'>
      <header>
        <button onClick={() => navigateTo('products')}>View Products</button>
        <button onClick={() => navigateTo('cart')}>Go to Cart ({cart.length})</button>
      </header>
      {page === 'products' && renderProducts()}
      {page === 'cart' && renderCart()}
    </div>
  );
}



export default App;
