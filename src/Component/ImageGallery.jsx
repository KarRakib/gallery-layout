import React, { useContext, useEffect, useState } from 'react';
import { GalleryProvider } from '../Provider/ImageProvider';

const ImageGallery = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { handleImageClick, handleCheckboxChange, selectedImageIndex } = useContext(GalleryProvider);
  const [images, setImages] = useState([])
  const [inputImages, setInputImage] = useState([])
  console.log('all image', selectedImageIndex);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      const storedData = localStorage.getItem('uploadedImages');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setImages(parsedData);
        } catch (error) {
          console.error('Error parsing data from localStorage:', error);
        }
      }
    };


    fetchDataFromLocalStorage();

    const interval = setInterval(fetchDataFromLocalStorage, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader);
        const newImages = [...images];

        if (targetIndex !== null && targetIndex >= 0) {
          newImages.splice(targetIndex, 0, { image: reader.result });
        } else {
          newImages.push({ image: reader.result });
        }

        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleImageDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };
  const handleImageDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);

    if (targetIndex !== null && targetIndex >= 0) {
      newImages.splice(targetIndex, 0, draggedItem);
    } else {
      newImages.push(draggedItem);
    }

    setImages(newImages);
  };
  const imagebbKey = (import.meta.env.VITE_IMAGEBB_KEY)
  console.log(imagebbKey);
  const handleImageInputChange = async (e) => {
    const file = e.target.files[0];
    console.log('file', file);
    if (file) {
      const formData = new FormData();
      formData.append('image', file)
      try {
        const url = `https://api.imgbb.com/1/upload?key=${imagebbKey}`
        const response = await fetch(url, {
          method: 'POST',
          body: formData,

        });

        const data = await response.json();
        if (data.data) {
          console.log('Image uploaded successfully. ImageBB URL:', data.data.url);
          const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
          storedImages.push({ image: data.data.url });
          localStorage.setItem('uploadedImages', JSON.stringify(storedImages));

        } else {
          console.error('Image upload failed:', data.error);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = () => {
        console.log('rd', reader);
        setInputImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div
      onDrop={(e) => handleDrop(e, null)}
      onDragOver={handleDragOver}
      className="grid md:grid-cols-5 grid-cols-3 grid-rows-4 md:grid-rows-3 gap-4">
      {
        images.map((data, i) => (
          // eslint-disable-next-line react/jsx-key
          <div key={i}
            draggable
            onDragStart={(e) => handleImageDragStart(e, i)}
            onDrop={(e) => handleImageDrop(e, i)}
            onDragOver={handleDragOver}
            className={`relative border rounded-md ${i === 0 ? 'col-span-2 w-full row-span-2' : ''
              }`}>
            <img className={`block w-full h-full ${selectedImageIndex.includes(i) ? 'opacity-50' : 'opacity-100'}`} src={data.image} alt="" />
            <div className="content">

              <input

                onChange={handleCheckboxChange}

                onClick={() => handleImageClick(i)} className='w-5 h-5 pt-7' type="checkbox" name="" id="" />
            </div>
          </div>
        )
        )

      }
      <label className="filelabel w-32 h-full md:w-full border">
        <img className='w-6 h-6 mt-20' src="https://i.ibb.co/Lg3Nrv6/icon-image-512.png" alt="add Image" />
        <span className="title pb-28">
          Add Images
        </span>
        <input className="FileUpload1" id="FileInput" type="file"
          name="images"
          onChange={handleImageInputChange}
          accept="image/png , image/jpeg, image/webp" />
      </label>
    </div>
  );
};

export default ImageGallery;