import React, { useState, useRef } from 'react';
import { compress } from 'image-conversion';


const ImageCompress = () => {
    const [uploadImage, setUploadImage] = useState(false);
    const [originalImage, setOriginalImage] = useState(null);
    const [originalLink, setOriginalLink] = useState("");
    const [compressionQuality, setCompressionQuality] = useState(0.8);
    const [compressedLink, setCompressedLink] = useState("");
    const [compressedSize, setCompressedSize] = useState(0);
    const [originalSize, setOriginalSize] = useState(0);
    const [filter, setFilter] = useState("none");
    const [brightness, setBrightness] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [hue, setHue] = useState(0);
    const [contrast, setContrast] = useState(100);
    const [opacity, setOpacity] = useState(100);
    const canvasRef = useRef(null);

    const uploadLink = (event) => {
        const imageFile = event.target.files[0];
        setOriginalLink(URL.createObjectURL(imageFile));
        setOriginalImage(imageFile);
        setUploadImage(true);
        setOriginalSize(imageFile.size);
    };

    const compressImage = async () => {
        if (originalImage) {
            try {
                const compressedImage = await compress(originalImage, { quality: compressionQuality });
                setCompressedLink(URL.createObjectURL(compressedImage));
                setCompressedSize(compressedImage.size);
            } catch (error) {
                console.error("Image compression failed:", error);
            }
        }
    };

    const applyFilter = (filterValue) => {

        setFilter(filterValue);
    };

    const combinedFilter = `brightness(${brightness}%) saturate(${saturation}%) hue-rotate(${hue}deg) contrast(${contrast}%) opacity(${opacity}%) ${filter}`;

    const downloadAdjustedImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = compressedLink;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = combinedFilter;
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'adjusted_image.jpg';
            link.click();
        };
    };
    const downloadCompressedImage = () => {
        const link = document.createElement('a');
        link.href = compressedLink;
        link.download = 'compressed_image.jpg';
        link.click();
    };

    return (
        <div id="imageContainer" className="p-4 justify-evenly w-full  flex flex-col sm:flex-row overflow-auto">
            <div id="upload" className='p-4 mt-4 h-fit bg-blue-200 shadow-lg shadow-blue-500/50 rounded-lg w-full md:w-1/5'>
                {uploadImage ? (
                    <>
                        <div className='p-5 flex justify-center'>
                            <img src={originalLink} alt="Original" className="my-2 w-3/2" />
                        </div>

                        <div>
                            <label htmlFor="qualitySlider" className='flex justify-center'>Compress Size</label>
                            <p className='flex justify-center'>Original Size: {Math.round(originalSize / 1024)} KB</p>
                            <div className=' flex justify-center'>
                                <input
                                    type="range"
                                    name="qualitySlider"
                                    id="qualitySlider"
                                    min="0.1"
                                    max="1"
                                    step="0.0125"
                                    value={compressionQuality}
                                    onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
                                    className="my-2"
                                />
                            </div>
                            <div className='flex justify-center gap-3  '>

                                <button
                                    className="my-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-xs "
                                    onClick={() => window.location.reload()}
                                >
                                    Upload New Image
                                </button>


                                <button onClick={compressImage} className="my-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-xs">
                                    Compress Image
                                </button>
                            </div>
                        </div>

                    </>
                ) : (
                    <>

                        <div>
                            <input type="file" name="image" id="uploadBtn" onChange={uploadLink} />
                        </div>
                    </>
                )}
            </div>

            {compressedLink && (
                <>
                    <div id="viewupload" className=" p-4 mt-4 bg-blue-200 shadow-lg shadow-blue-500/50 rounded-md flex flex-col justify-center md:w-[60vw]">
                        <div className="flex justify-center bg-neutral-50 shadow-lg w-full">
                            <img
                                id="image"
                                src={compressedLink}
                                alt="Compressed"
                                className="my-2 drop-shadow-2xl object-contain w-full"
                                style={{ filter: combinedFilter, objectFit: "cover" }}
                            />
                        </div>
                        <p className='flex justify-center'>Compressed Size: {Math.round(compressedSize / 1024)} KB</p>

                        {filter !== "none" && (
                            <div id="adjust">
                                <div className='flex justify-center m-1'>
                                    <label htmlFor="brightness" className='w-1/2 flex '>Brightness</label>
                                    <input
                                        className=' bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                                        type="range"
                                        name="brightness"
                                        id="brightness"
                                        min="0"
                                        max="200"
                                        value={brightness}
                                        onChange={(e) => setBrightness(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-center m-1'>
                                    <label htmlFor="saturation" className='w-1/2 flex '>Saturation</label>
                                    <input
                                        className=' bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                                        type="range"
                                        name="saturation"
                                        id="saturation"
                                        min="0"
                                        max="200"
                                        value={saturation}
                                        onChange={(e) => setSaturation(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-center m-1'>
                                    <label htmlFor="hue" className='w-1/2 flex '>Hue</label>
                                    <input
                                        className=' bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                                        type="range"
                                        name="hue"
                                        id="hue"
                                        min="0"
                                        max="360"
                                        value={hue}
                                        onChange={(e) => setHue(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-center m-1'>
                                    <label htmlFor="contrast" className='w-1/2 flex '>Contrast</label>
                                    <input
                                        className=' bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                                        type="range"
                                        name="contrast"
                                        id="contrast"
                                        min="0"
                                        max="200"
                                        value={contrast}
                                        onChange={(e) => setContrast(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-center m-1 '>
                                    <label htmlFor="opacity" className='w-1/2 flex '>Opacity</label>
                                    <input
                                        className=' bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                                        type="range"
                                        name="opacity"
                                        id="opacity"
                                        min="0"
                                        max="100"
                                        value={opacity}
                                        onChange={(e) => setOpacity(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div id="filter" className="flex flex-wrap justify-center">
                            <button onClick={() => applyFilter('none')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">None</button>
                            <button onClick={() => applyFilter('blur(5px)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Blur</button>
                            <button onClick={() => applyFilter('brightness(200%)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Brightness</button>
                            <button onClick={() => applyFilter('contrast(200%)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Contrast</button>
                            <button onClick={() => applyFilter('drop-shadow(8px 8px 10px gray)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Drop Shadow</button>
                            <button onClick={() => applyFilter('grayscale(100%)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Grayscale</button>
                            <button onClick={() => applyFilter('hue-rotate(90deg)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Hue Rotate</button>
                            <button onClick={() => applyFilter('invert(100%)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Invert</button>
                            <button onClick={() => applyFilter('opacity(30%)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Opacity</button>
                            <button onClick={() => applyFilter('saturate(8)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Saturate</button>
                            <button onClick={() => applyFilter('sepia(100%)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Sepia</button>
                            <button onClick={() => applyFilter('contrast(200%) brightness(150%)')} className="border p-2 rounded-md bg-slate-700 text-white hover:bg-slate-900 m-1 w-1/4 text-xs">Contrast + Brightness</button>
                        </div>


                        <div className='flex justify-evenly flex-wrap'>
                            <div>
                                <button
                                    onClick={downloadAdjustedImage}
                                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                                >
                                    Download Adjusted Image
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={downloadCompressedImage}
                                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg"
                                >
                                    Download Compressed Image
                                </button>
                            </div>

                        </div>
                    </div>
                </>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <h3 style={{ position: 'fixed', bottom: '0%', left: '0%', fontSize: '10px' }}>A Project by <a href="https://github.com/AbhishekChavan3030">Abhishek Chavan</a></h3>
        </div>

    );
};
export default ImageCompress;
