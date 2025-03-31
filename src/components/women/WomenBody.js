import React from 'react'
import { imgMenArr, imgWomenArr, imgWomenOfferArr, offerImg } from '../body/imgUrl'

function WomenBody() {
  return (
    <div className='col text-center'>
    <img className='col-10 mt-4'
      src='https://fashionova-bucket.s3.us-west-1.amazonaws.com/Screenshot_20250205-185749_1.jpg'
      height={'350px'} alt='banner' />

    <img className='col-11 mt-4 m-4'
      src='https://fashionova-bucket.s3.us-west-1.amazonaws.com/Screenshot_20250205-185553_1.jpg'
      height={'150px'} alt='banner' />

    <div className='col-12 p-2'>
      {imgWomenArr.map(val => {
        console.log(val)
        return <img src={val.img} className='col-2' alt='shradda' />
      })}
    </div>

    <img className='col-11 mt-4 m-4'
      src='https://fashionova-bucket.s3.us-west-1.amazonaws.com/Screenshot_20250205-185643_1.jpg'
      height={'100px'} alt='banner' />

    <div className='col-12 p-2'>
      {imgWomenOfferArr.map(val => {
        console.log(val)
        return <img src={val.img} className='col-2' alt='shradda' />
      })}
    </div>


    <img className='col-11 mt-4 m-4'
      src='https://fashionova-bucket.s3.us-west-1.amazonaws.com/Screenshot_20250205-185710_1.jpg'
      height={'150px'} alt='banner' />

    <div className='col-12 p-2'>
      {imgWomenArr.map(val => {
        console.log(val)
        return <img src={val.img} className='col-2' alt='shradda' />
      })}
    </div>
  </div>
  )
}

export default WomenBody