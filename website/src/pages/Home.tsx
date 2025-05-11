import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

// Importar las imágenes para la galería
import home1 from "../assets/home1.png";
import home2 from "../assets/home2.png";
import home3 from "../assets/home3.png";
import home6 from "../assets/home6.png";
import home5 from "../assets/home8.png";

export default function Home() {
  // Estado para la imagen activa (hover)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Datos de las imágenes
  const slides = [
    { 
      img: home1,
      title: "Revolutionizing Urban Delivery",
      subtitle: "Modern solutions for tomorrow's logistics challenges"
    },
    {
      img: home2,
      title: "Autonomous Delivery Robots",
      subtitle: "Efficient, sustainable last-mile transportation"
    },
    {
      img: home3,
      title: "Smart Logistics Technology",
      subtitle: "Optimizing delivery routes in real-time"
    },
    {
      img: home6,
      title: "Eco-Friendly Transportation",
      subtitle: "Reducing carbon footprint in urban delivery"
    },
    {
      img: home5,
      title: "Future of Urban Mobility",
      subtitle: "Transforming how goods move through cities"
    }
  ];

  // Add page-active class after component mounts for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.page-transition')?.classList.add('page-active');
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-transition min-h-screen">
      {/* Header con título principal */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12 md:py-16 px-4 relative"
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-10"></div>
          <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-10"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            The Future of Urban Delivery
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto my-6"></div>
          <p className="mt-4 text-xl text-gray-700 max-w-2xl mx-auto font-light">
            Exploring innovative solutions for tomorrow's urban logistics
          </p>
        </div>
      </motion.div>
      
      {/* Galería de imágenes horizontal */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-row space-x-2 h-[500px]">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer gallery-item ${
                activeIndex === index ? 'flex-[5] gallery-item-expanded' : 'flex-[1]'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Imagen de fondo */}
              <div className="absolute inset-0">
                <img 
                  src={slide.img} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
              </div>
              
              {/* Contenido siempre visible */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
                {/* Título que solo aparece cuando se amplía */}
                {activeIndex === index && (
                  <div>
                    <h2 className="text-3xl font-bold text-white transition-all duration-500">
                      {slide.title}
                    </h2>
                  </div>
                )}
                
                {/* Contenido que aparece al hacer hover, en la parte inferior */}
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                  >
                    <p className="text-lg text-white/90 mb-6 max-w-md">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
                      <Link 
                        to="/comparison" 
                        className="bg-white/90 text-blue-800 px-5 py-2 rounded-full font-medium hover:bg-white transition-all text-sm md:text-base"
                      >
                        Compare <FaArrowRight className="inline ml-1" />
                      </Link>
                      <Link 
                        to="/simulation" 
                        className="bg-blue-600/90 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-600 transition-all text-sm md:text-base"
                      >
                        Simulate <FaArrowRight className="inline ml-1" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Sección de "Learn More" */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="flex flex-col items-center text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-10 shadow-lg">
            <h2 className="text-3xl font-bold mb-4">Revolutionizing Urban Delivery</h2>
            <p className="text-xl max-w-2xl mb-8">
              Explore how autonomous delivery robots are transforming last-mile logistics in urban environments
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center bg-white text-blue-700 rounded-full px-8 py-4 font-bold shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
            >
              Learn more about our project <FaArrowRight className="inline ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}