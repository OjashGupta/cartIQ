import React, { useRef } from 'react'
import HomeCart from '../component/HomeCart'
import { useSelector } from 'react-redux'
import CartFeature from '../component/CartFeature'
import {GrFormNext, GrFormPrevious} from 'react-icons/gr'
import AllProduct from '../component/AllProduct'

const Home = () => {
  const productData = useSelector((state)=>state.product.productList)
  // console.log(productData)
  const homeProductCartList = productData.slice(12,18)

  const homeProductCartListVegetable = productData.filter(el => el.category === "vegetable")
  // console.log(homeProductCartListVegetable)

  const loadingArray = new Array(6).fill(null)
  const loadingArrayFeature = new Array(10).fill(null)

  const slideProductRef = useRef()
  const nextProduct =()=>{
    slideProductRef.current.scrollLeft += 925
  }

  const previousProduct =()=>{
    slideProductRef.current.scrollLeft -= 925
  }

  
  // console.log(categoryList) 

  return (
    <div className='p-2 md:p-4'>
      <div className='md:flex gap-4 py-2'>

        <div className='md:w-1/2'>
          {/* <div className='flex gap-3 bg-white w-36 px-2 items-center rounded-full'>
            <p className='text-sm font-medium text-slate-900'>Bike Delivery</p>
            <img src="https://thenounproject.com/api/private/icons/4303170/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0" alt='Loading' className='h-7' />
          </div> */}
          <h2 className='text-4xl md:text-7xl font-bold py-3'>Grocery {" "}
          <span className='text-green-700 text-5xl md:text-7xl'>Delivery App</span></h2>
          <p className='py-3 text-base'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, iusto, excepturi animi vero praesentium unde, veritatis dolorem facere officiis laboriosam fuga eum provident inventore assumenda incidunt blanditiis doloribus? Alias, possimus!</p>
          {/* <button className='font-bold bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2'>Order Now</button> */}
        </div>
        {/* <div className='md:w-1/2 flex flex-wrap gap-5 p-4 justify-center'>
          {
            homeProductCartList[0] ? homeProductCartList.map(el =>{
              return(
                <HomeCart
                  key = {el._id}
                  id= {el._id}
                  image = {el.image}
                  name = {el.name}
                  price = {el.price}
                  category = {el.category}
                />
              )
            })
            :
            loadingArray.map((el, index) => {
              return(
                <HomeCart 
                  key = {index+"loading"}
                  loading = {"Loading..."}
                />
              )
            })
          }
          
        </div> */}
      </div>
            <AllProduct heading={"Your Fresh Products"}/>
        
    </div>
  )
}

export default Home
