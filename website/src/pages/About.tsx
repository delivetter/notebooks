import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaGraduationCap, FaLeaf } from "react-icons/fa";
import { useEffect } from "react";
import dataImage from "../assets/catastro.png";

export default function About() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".page-transition")?.classList.add("page-active");
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-transition">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6 border-b pb-4"
        >
          About DELIVETTER
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4">Project Vision</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            DELIVETTER is an academic project focused on redesigning last-mile delivery in urban areas through the integration of autonomous delivery robots.
            Inspired by the BotNet and ONA initiatives in Barcelona, we adapted the concept to the reality of Valencia, applying it at the neighborhood level.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li><strong>Model 1 (M1)</strong>: Van-based delivery with pedestrian segments</li>
            <li><strong>Model 2 (M2)</strong>: Fully autonomous delivery using urban robots</li>
          </ul>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="text-primary text-4xl mb-4">
              <FaGraduationCap />
            </div>
            <h3 className="text-xl font-semibold mb-3">Academic Challenge</h3>
            <p className="text-gray-700">
              Developed as part of a Bachelor's Degree in Data Science at UPV, this project brings together data modeling, logistics, and environmental impact assessment to evaluate innovative delivery systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="text-secondary text-4xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-3">Data-Driven Optimization</h3>
            <p className="text-gray-700">
              We apply graph theory, clustering algorithms and spatial analysis techniques to model real urban logistics challenges. 
              Using Python and geospatial libraries, we simulate and evaluate delivery strategies based on travel time, distance and load balancing.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold mb-4">Data & Methodology</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We integrated data from OpenStreetMap, the Spanish Catastro, and Valencia's open data portal to build multimodal urban graphs. Using Python libraries like OSMnx and geopandas, we developed and simulated delivery routes optimized by walking distance, vehicle access, and delivery capacity.
          </p>
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10"
          >
            <img
              src={dataImage}
              alt="Map showing warehouses and stores extracted via pycatastro"
              className="rounded-lg shadow-md w-full max-w-3xl mx-auto"
            />
            <figcaption className="text-sm text-center text-gray-500 mt-2">
              Warehouses (red), stores (blue), and combined use (black) extracted using PyCatastro over Valencia's cadastral and OSM data.
            </figcaption>
          </motion.figure>
          <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold mb-2">Interactive Simulation</h3>
            <p className="text-gray-700">
              The project features interactive simulations where users can explore delivery dynamics for each model in real time, comparing metrics across different scenarios and neighborhoods.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">The Team</h2>
          <p className="text-gray-700 mb-6">
            DELIVETTER was created by a multidisciplinary team of Data Science students from Universitat Politècnica de València:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>José Aguilar Camps</li>
            <li>Anna Aparici Nogués</li>
            <li>José Milán Server</li>
            <li>Joel Moncho Mas</li>
            <li>Juan José Prades García</li>
            <li>Daniel Reinón García</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
