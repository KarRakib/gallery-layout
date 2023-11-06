import React, { createContext, useState } from 'react';
export const GalleryProvider = createContext()
const ImageProvider = ({children}) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState([]);
    
    const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
    console.log(selectedImageIndex);
    const handleImageClick = (index) => {
        if (selectedImageIndex.includes(index)) {
          setSelectedImageIndex(selectedImageIndex.filter((item) => item !== index));
        } else {
          setSelectedImageIndex([...selectedImageIndex, index]);
        }
      };
      const imageValue = {handleImageClick,setSelectedImageIndex,isChecked,handleCheckboxChange,selectedImageIndex}
    return (
        <GalleryProvider.Provider value={imageValue}>
            {children}
        </GalleryProvider.Provider>
    );
};

export default ImageProvider;