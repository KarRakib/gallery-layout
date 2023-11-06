import React, { useContext } from 'react';
import { GalleryProvider } from '../Provider/ImageProvider';

const Nav = () => {
    const {selectedImageIndex,setSelectedImageIndex} = useContext(GalleryProvider)
    const handleDeleteSelectedImages = () => {
      // Retrieve the existing data from localStorage
      const storedData = localStorage.getItem('uploadedImages');
    
      if (storedData) {
        try {
          // Parse the data from localStorage
          const parsedData = JSON.parse(storedData);
    
          // Remove selected images from the parsed data
          const updatedData = parsedData.filter((_, index) => !selectedImageIndex.includes(index));
    
          // Update localStorage with the modified data
          localStorage.setItem('uploadedImages', JSON.stringify(updatedData));
    
          // Clear the selectedImageIndex
          setSelectedImageIndex([]);
        } catch (error) {
          console.error('Error parsing or updating data from localStorage:', error);
        }
      }
    };   
    return (
        <div className='px-10'>
           {selectedImageIndex?.length ? <div className=' flex justify-between py-2'>
                <div className='flex items-center'>
                <input type="checkbox" id="vehicle1" checked name="vehicle1" className='w-6 h-5' value="Bike" /> {selectedImageIndex?.length} Files Selected
                </div>
           
                <button onClick={handleDeleteSelectedImages} className='text-xl font-semibold text-rose-600'> Delete Files </button>
            </div> : <h1 className='font-bold text-xl'>Gallery</h1> }
            <hr className='my-3' />
        </div>
    );
};

export default Nav;