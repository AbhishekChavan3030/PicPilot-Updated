import React from 'react';
import ImageCompress from './Components/ImageCompress';
import HeaderBar from './Components/HeaderBar';
function App() {
  return (
    <div  id='App' style={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 400, fontStyle: 'normal' }}>
      <HeaderBar />
      <ImageCompress />
    </div>
  )
}

export default App