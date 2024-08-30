// import React from 'react'
// import { useSelector } from 'react-redux'
// import CartProduct from '../component/CartProduct'
// import { toast } from 'react-hot-toast'
// import {loadStripe} from '@stripe/stripe-js'
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const productCartItem = useSelector((state) =>state.product.cartItem)
//   // console.log(productCartItem)

//   const user = useSelector(state => state.user)
//   const navigate = useNavigate()

//   const totalPrice = productCartItem.reduce((acc,curr) => acc + parseInt(curr.total), 0)

//   const totalQty = productCartItem.reduce((acc,curr) => acc + parseInt(curr.qty), 0)

//   const handlePayment = async()=>{

//     // if(user.email){
        
//     //     const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
//     //     const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/create-checkout-session`,{
//     //       method : "POST",
//     //       headers  : {
//     //         "content-type" : "application/json"
//     //       },
//     //       body  : JSON.stringify(productCartItem)
//     //     })
//     //     if(res.statusCode === 500) return;

//     //     const data = await res.json()
//     //     // console.log(data)

//     //     toast("Redirect to payment Gateway...!")
//     //     stripePromise.redirectToCheckout({sessionId : data}) 
//     // }
//     // else{
//     //   toast("You have not Login!")
//     //   setTimeout(()=>{
//     //     navigate("/login")
//     //   },500)
//     // }
//   }

//   return (
//     <>
//       <div className='p-2 md:p-4 bg-white'>
//         <h2 className='text-green-700 md:text-7xl font-bold py-3'>Your Cart</h2>

//         { productCartItem[0] ?
//           <div className='my-4 flex gap-3'>
//             {/* Your Display Cart */}
//             <div className='w-full max-w-3xl'>
//                   {
//                     productCartItem.map(el => {
//                       return(
//                         <CartProduct  
//                           key={el._id}
//                           id = {el._id}
//                           name = {el.name}
//                           image = {el.image}
//                           category = {el.category} 
//                           qty = {el.qty}
//                           total = {el.total}
//                           price={el.price}
//                         />
//                       )
//                     })
//                   }            
//             </div>
//             {/* Total Cart Items */}
//             <div className='w-full max-w-md bg-white ml-auto shadow-lg rounded-lg overflow-hidden'>
//               <h2 className='bg-green-500 text-white p-4 text-lg font-semibold text-center'>Summary</h2>
//               <div className='flex justify-between items-center py-3 px-4 text-lg border-b'>
//                   <p className='font-medium'>Total Quantity:</p>
//                   <p className='font-bold text-lg'>{totalQty}</p>
//               </div>
//               <div className='flex justify-between items-center py-3 px-4 text-lg border-b'>
//                   <p className='font-medium'>Total Price:</p>
//                   <p className='font-bold text-lg'>
//                       <span className='text-red-500'>₹</span>{totalPrice}
//                   </p>
//               </div>
//               <button className='bg-green-500 w-full text-lg font-bold py-3 text-white hover:bg-green-600 transition duration-200' onClick={handlePayment}>
//                   Payment
//               </button>
//             </div>
//           </div>
//           :
//           <>
//             <div className='flex justify-center items-center h-full w-full flex-col'>
//               <img src="https://assets.materialup.com/uploads/66fb8bdf-29db-40a2-996b-60f3192ea7f0/preview.png" className='w-full max-w-2xl' alt="Loading" />
//               <p className='text-green-700 text-3xl font-bold'>Empty Cart</p>
//             </div>
//           </>
//         }
//       </div>
//     </>
//   )
// }

// export default Cart

import React from 'react'
import { useSelector } from 'react-redux'
import CartProduct from '../component/CartProduct'
import { toast } from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const totalPrice = productCartItem.reduce((acc, curr) => acc + parseInt(curr.total), 0)
  const totalQty = productCartItem.reduce((acc, curr) => acc + parseInt(curr.qty), 0)

  const handlePayment = async () => {
    // Payment logic
  }

  return (
    <div className='p-4 md:p-8 bg-gray-100'>
      <h2 className='text-green-700 md:text-5xl font-bold py-4'>Your Cart</h2>

      {productCartItem[0] ?
        <div className='my-6 flex flex-col md:flex-row gap-6'>
          <div className='w-full md:w-3/4 bg-white p-4 rounded-lg shadow-md'>
            {productCartItem.map(el => (
              <CartProduct
                key={el._id}
                id={el._id}
                name={el.name}
                image={el.image}
                category={el.category}
                qty={el.qty}
                total={el.total}
                price={el.price}
              />
            ))}
          </div>

          <div className='w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md'>
            <h2 className='text-green-700 font-bold text-2xl mb-4'>Summary</h2>
            <div className='flex justify-between items-center py-2 text-lg border-b'>
              <p className='font-medium'>Total Quantity:</p>
              <p className='font-bold text-lg'>{totalQty}</p>
            </div>
            <div className='flex justify-between items-center py-2 text-lg border-b'>
              <p className='font-medium'>Total Price:</p>
              <p className='font-bold text-lg'>
                <span className='text-red-500'>₹</span>{totalPrice}
              </p>
            </div>
            <button className='bg-green-500 w-full text-lg font-bold py-3 text-white hover:bg-green-600 transition duration-200' onClick={handlePayment}>
              Payment
            </button>
          </div>
        </div>
        :
        <div className='flex justify-center items-center h-full w-full flex-col'>
          <img src="https://assets.materialup.com/uploads/66fb8bdf-29db-40a2-996b-60f3192ea7f0/preview.png" className='w-full max-w-2xl' alt="Loading" />
          <p className='text-green-700 text-3xl font-bold'>Empty Cart</p>
        </div>
      }
    </div>
  )
}

export default Cart
