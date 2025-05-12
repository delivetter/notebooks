import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  FaTruck, 
  FaRobot, 
  FaLeaf, 
  FaClock, 
  FaMoneyBillWave, 
  FaWeightHanging, 
  FaCity,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaBox,
  FaRoute,
  FaShippingFast,
  FaTrafficLight,
  FaMapMarkedAlt,
  FaHandsHelping,
  FaBug
} from "react-icons/fa";
import { useEffect, useState } from "react";
import logisticsImg from "../assets/logistics1.png";
import robotsImg from "../assets/robots.png";
import m1Image from "../assets/m1.jpg";
import m2Image from "../assets/m2.jpg";
export default function Comparison() {
  // State to keep track of which model is being hovered
  const [hoverModel, setHoverModel] = useState<'traditional' | 'autonomous' | null>(null);
  
  // Animation on page mount for container
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.page-transition')?.classList.add('page-active');
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Traditional model details components that show on hover
  const TraditionalDetails = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="mt-4 overflow-hidden"
    >
      <motion.div 
        className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-5 mb-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
      >
        <motion.div
          className="mt-6 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <img src={m1Image} alt="Traditional delivery van" className="w-full object-cover rounded-lg shadow-md" />
        </motion.div>
        <motion.div 
          className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 text-sm text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="mb-2 font-semibold">How it works?</p>
          <p className="mb-1">
            The delivery van enters the neighborhood from the outskirts and stops at key loading points. 
            From each stop, the driver sets out on foot to deliver packages to nearby stores.
          </p>
          <p>
            The van follows an optimized route between loading zones, and each walking segment is planned to 
            balance delivery loads and minimize distance, ensuring an efficient flow through the urban area.
          </p>
        </motion.div>




        <div className="grid md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <h4 className="font-bold text-green-700 mb-2 flex items-center">
              <FaCheck className="text-green-500 mr-2" /> Advantages
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start bg-green-50 p-2 rounded-lg">
                <FaBox className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Higher cargo capacity for bulk deliveries</span>
              </li>
              <li className="flex items-start bg-green-50 p-2 rounded-lg">
                <FaRoute className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Long range for suburban routes</span>
              </li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
            <h4 className="font-bold text-red-700 mb-2 flex items-center">
              <FaTimes className="text-red-500 mr-2" /> Challenges
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start bg-red-50 p-2 rounded-lg">
                <FaLeaf className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Higher emissions and fuel costs</span>
              </li>
              <li className="flex items-start bg-red-50 p-2 rounded-lg">
                <FaTrafficLight className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Prone to traffic congestion</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-3 border-b border-blue-100 pb-2">Operating Costs - Source: Spanish Ministry of Transport</h3>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Fixed Costs</h4>
            <div className="space-y-1 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle amortization:</span>
                <span className="text-blue-700">6.69 €/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle financing:</span>
                <span className="text-blue-700">1.64 €/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance:</span>
                <span className="text-blue-700">12.11 €/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax costs:</span>
                <span className="text-blue-700">1.47 €/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Indirect costs:</span>
                <span className="text-blue-700">9.85 €/day</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-200 mt-1">
                <span>Total fixed costs:</span>
                <span className="text-blue-700">31.76 €/day</span>
              </div>
            </div>
          </div>
            
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Time-based Costs</h4>
            <div className="space-y-1 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Driver personnel:</span>
                <span className="text-blue-700">17.82 €/hour</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allowances:</span>
                <span className="text-blue-700">3.36 €/hour</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-200 mt-1">
                <span>Total time-based costs:</span>
                <span className="text-blue-700">21.19 €/hour</span>
              </div>
            </div>
          </div>
            
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Distance-based Costs</h4>
            <div className="space-y-1 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel:</span>
                <span className="text-blue-700">0.135 €/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Urea solution:</span>
                <span className="text-blue-700">0.006 €/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tires:</span>
                <span className="text-blue-700">0.014 €/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maintenance:</span>
                <span className="text-blue-700">0.011 €/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Repairs:</span>
                <span className="text-blue-700">0.019 €/km</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-200 mt-1">
                <span>Total distance-based costs:</span>
                <span className="text-blue-700">0.184 €/km</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
  
  // Autonomous model details components that show on hover
  const AutonomousDetails = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="mt-4 overflow-hidden"
    >
      <motion.div 
        className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-5 mb-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
      >
        <motion.div
          className="mt-6 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <img src={m2Image} alt="Autonomous delivery robot" className="w-full object-cover rounded-lg shadow-md" />
        </motion.div>
        <motion.div 
          className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6 text-sm text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="mb-2 font-semibold">How it works?</p>
          <p className="mb-1">
            Autonomous robots depart from a central warehouse and handle deliveries entirely on foot 
            within pre-assigned urban zones. Each robot is responsible for one cluster of stores.
          </p>
          <p>
            Delivery areas are grouped using clustering algorithms, and each robot follows a closed-loop 
            route that respects its weight capacity and battery range, perfect for navigating dense, pedestrian-friendly cities.
          </p>
        </motion.div>




        <div className="grid md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <h4 className="font-bold text-green-700 mb-2 flex items-center">
              <FaCheck className="text-green-500 mr-2" /> Advantages
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start bg-green-50 p-2 rounded-lg">
                <FaLeaf className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Zero emissions operation</span>
              </li>
              <li className="flex items-start bg-green-50 p-2 rounded-lg">
                <FaCity className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Bypasses traffic on sidewalks</span>
              </li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
            <h4 className="font-bold text-red-700 mb-2 flex items-center">
              <FaTimes className="text-red-500 mr-2" /> Challenges
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start bg-red-50 p-2 rounded-lg">
                <FaBox className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Limited cargo capacity</span>
              </li>
              <li className="flex items-start bg-red-50 p-2 rounded-lg">
                <FaRoute className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Shorter operational range</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <h3 className="text-xl font-semibold text-purple-700 mb-3 border-b border-purple-100 pb-2">Operating Costs - Source:{" "}
            <a
            href="https://www.vaivelogistics.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Vaive Logistics
          </a></h3>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Fixed Costs</h4>
            <div className="space-y-1 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle amortization:</span>
                <span className="text-purple-700">22.82 €/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle insurance:</span>
                <span className="text-purple-700">10.96 €/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax costs:</span>
                <span className="text-purple-700">1.64 €/day</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-200 mt-1">
                <span>Total fixed costs:</span>
                <span className="text-purple-700">35.42 €/day</span>
              </div>
            </div>
          </div>
            
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Time-based Costs</h4>
            <div className="space-y-1 font-mono text-sm">
              
              <div className="flex justify-between">
                <span className="text-gray-600">Operation cost:</span>
                <span className="text-purple-700">9.58 €/hour</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-200 mt-1">
                <span>Total time-based costs:</span>
                <span className="text-purple-700">9.58 €/hour</span>
              </div>
            </div>
          </div>
            
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Distance-based Costs</h4>
            <div className="space-y-1 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Energy (electric):</span>
                <span className="text-purple-700">0.017 €/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Maintenance and repairs:</span>
                <span className="text-purple-700">0.038 €/km</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-gray-200 mt-1">
                <span>Total distance-based costs:</span>
                <span className="text-purple-700">0.055 €/km</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="page-transition">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 py-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-blue-100/50 rounded-xl"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300 rounded-full blur-3xl opacity-20 -ml-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-20 -mr-10 -mb-10"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Delivery Models Comparison
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4"></div>
            
            <p className="text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
              Hover over each delivery model to explore its features in detail. Each approach offers 
              unique advantages for different urban delivery scenarios.
            </p>
          </div>
        </motion.div>
        
        {/* Dramatic Interactive Model Showcase */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-20"
        >
          {/* Container that holds both models */}
          <div className="relative flex flex-col md:flex-row items-stretch gap-4 min-h-[450px] h-full md:items-stretch">
            
            {/* Traditional Model Card */}
            <div 
              className={`model-showcase model-traditional rounded-xl overflow-hidden shadow-lg ${
                hoverModel === 'traditional' ? 'flex-[3]' : 
                hoverModel === 'autonomous' ? 'flex-[1]' : 'flex-[1]'
              }`}
              style={{ 
                boxShadow: hoverModel === 'traditional' 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              onMouseEnter={() => setHoverModel('traditional')}
              onMouseLeave={() => setHoverModel(null)}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-20 -ml-10 -mb-10"></div>
              </div>
              
              <div className="relative z-10 p-8 h-full flex flex-col">
                <motion.div 
                  className="flex items-center"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-white p-4 rounded-full mr-5 shadow-lg">
                    <FaTruck className="text-3xl text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Traditional Delivery</h2>
                    <p className="text-blue-100">Human-driven vehicles</p>
                  </div>
                </motion.div>
                
                {hoverModel !== 'traditional' && (
                  <motion.div 
                    className="mt-4 flex-1 flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="relative rounded-xl overflow-hidden mb-4 flex-1 min-h-[200px]">
                      <img 
                        src={logisticsImg}
                        alt="Delivery van logistics"
                        className="absolute w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-600/30">
                        {/* Quitamos el cuadro blanco central */}
                      </div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white border border-white/30 mt-auto">
                      <p className="font-medium mb-1">Conventional delivery vans have been the backbone of logistics for decades.</p>
                      <div className="text-center mt-1 font-medium">
                        <span className="inline-block animate-pulse">Hover to explore</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Detail content that shows on hover */}
                {hoverModel === 'traditional' && <TraditionalDetails />}
              </div>
            </div>
            
            {/* Autonomous Model Card */}
            <div 
              className={`model-showcase model-autonomous rounded-xl overflow-hidden shadow-lg ${
                hoverModel === 'autonomous' ? 'flex-[3]' : 
                hoverModel === 'traditional' ? 'flex-[1]' : 'flex-[1]'
              }`}
              style={{ 
                boxShadow: hoverModel === 'autonomous' 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              onMouseEnter={() => setHoverModel('autonomous')}
              onMouseLeave={() => setHoverModel(null)}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-30 -ml-20 -mt-20"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-20 -mr-10 -mb-10"></div>
              </div>
              
              <div className="relative z-10 p-8 h-full flex flex-col">
                <motion.div 
                  className="flex items-center"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-white p-4 rounded-full mr-5 shadow-lg">
                    <FaRobot className="text-3xl text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Autonomous Delivery</h2>
                    <p className="text-purple-100">AI-powered robots</p>
                  </div>
                </motion.div>
                
                {hoverModel !== 'autonomous' && (
                  <motion.div 
                    className="mt-4 flex-1 flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="relative rounded-xl overflow-hidden mb-4 flex-1 min-h-[200px]">
                      <img 
                        src={robotsImg}
                        alt="Autonomous delivery robot"
                        className="absolute w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-purple-600/30">
                        {/* Quitamos el cuadro blanco central */}
                      </div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white border border-white/30 mt-auto">
                      <p className="font-medium mb-1">Autonomous delivery robots represent cutting-edge urban logistics technology.</p>
                      <div className="text-center mt-1 font-medium">
                        <span className="inline-block animate-pulse">Hover to explore</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Detail content that shows on hover */}
                {hoverModel === 'autonomous' && <AutonomousDetails />}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg text-white mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2">Ready to Try the Simulation?</h2>
              <p className="mb-4 text-sm">
                Experience both delivery models in an interactive environment
              </p>
              <Link 
                to="/simulation#top" 
                className="inline-block bg-white text-blue-700 font-bold rounded-full px-6 py-2 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
              >
                Launch Simulation <FaArrowRight className="inline ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}