import React from 'react'
import Hero from '../components/Hero'

const Home = ({ setIsAuthModalOpen ,isLogin}) => {
  return (
    <>
    <Hero isLogin={isLogin} setIsAuthModalOpen={setIsAuthModalOpen} />
    </>
  )
}

export default Home