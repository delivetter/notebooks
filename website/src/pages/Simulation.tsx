import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
    FaInfo,
    FaTruck,
    FaRobot,
    FaMapMarkerAlt,
    FaBoxOpen,
    FaRoute,
    FaTrafficLight,
    FaPlayCircle,
    FaChartLine,
    FaClock,
    FaLeaf,
    FaMoneyBillWave,
    FaWarehouse,
    FaShoppingCart,
} from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import Papa from "papaparse";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import barrios from "@/assets/barris.json"; // asegúrate que está bien la ruta
import "leaflet/dist/leaflet.css";

// TypeScript interface for CSV rows
type SimulationRow = {
    modelo: string;
    barrio: string;
    comercios_barrio: number;
    cids_barrio: number;
    almacenes_barrio: number;
    paquetes: number;
    comercios_seleccionados: number;
    semilla: number;
    total_kms_walk: number;
    total_hours_walk: number;
    total_kms_drive: number;
    total_hours_drive: number;
    distance_cost_van: number;
    distance_cost_ona: number;
    time_cost_van: number;
    time_cost_ona: number;
    total_cost: number;
};

type Neighborhood = {
    barrio: string;
    almacenes_barrio: number;
    comercios_barrio: number;
    cids_barrio: number;
    paquetes: number[];
};

type PredefinedSelection = Record<"M1" | "M2", SimulationRow | null>;

type BarrioMapProps = {
    onSelectBarrio: (barrio: string) => void;
    selectedBarrio: string;
};

// Componente para gestionar el estilo y las interacciones del GeoJSON
function GeoJSONWithInteractions({
    selectedBarrio,
    onSelectBarrio,
}: {
    selectedBarrio: string;
    onSelectBarrio: (barrio: string) => void;
}) {
    const geoJsonRef = useRef<L.GeoJSON | null>(null);
    const map = useMap();

    // Estilos para los diferentes estados de los barrios
    const defaultStyle = {
        weight: 1,
        color: "#666",
        fillColor: "#f0f0f0",
        fillOpacity: 0.3,
    };

    const hoverStyle = {
        weight: 2,
        color: "#3B82F6",
        fillColor: "#BFDBFE",
        fillOpacity: 0.6,
    };

    const selectedStyle = {
        weight: 2,
        color: "#1D4ED8",
        fillColor: "#93C5FD",
        fillOpacity: 0.7,
    };

    // Resetea y aplica los estilos cuando cambia el barrio seleccionado
    useEffect(() => {
        if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer((layer: any) => {
                if (layer && layer.feature && layer.feature.properties) {
                    const featureName = layer.feature.properties.nombre;
                    if (featureName === selectedBarrio) {
                        layer.setStyle(selectedStyle);
                    } else {
                        layer.setStyle(defaultStyle);
                    }
                }
            });
        }
    }, [selectedBarrio, selectedStyle, defaultStyle]);

    // Configura las interacciones para cada feature del GeoJSON
    const onEachFeature = useCallback(
        (feature: any, layer: any) => {
            if (!feature || !feature.properties) return;
            const name = feature.properties.nombre;

            // Configura los eventos de interacción
            layer.on({
                // Al hacer clic, selecciona el barrio
                click: () => {
                    onSelectBarrio(name);
                },
                // Al pasar el ratón, muestra el estilo hover
                mouseover: () => {
                    if (name !== selectedBarrio) {
                        layer.setStyle(hoverStyle);
                    }

                    // Trae la capa al frente para mejor visualización
                    layer.bringToFront();
                },
                // Al quitar el ratón, restaura el estilo original
                mouseout: () => {
                    if (name !== selectedBarrio) {
                        layer.setStyle(defaultStyle);
                    } else {
                        layer.setStyle(selectedStyle);
                    }
                },
            });

            // Añade tooltip al pasar el ratón
            layer.bindTooltip(name, {
                direction: "top",
                sticky: true,
                offset: [0, -5],
                opacity: 0.9,
                className: "leaflet-tooltip-own",
            });
        },
        [selectedBarrio, onSelectBarrio]
    );

    useEffect(() => {
        // Crear la capa GeoJSON
        const geoJsonLayer = L.geoJSON(barrios as any, {
            style: (feature) => {
                if (!feature || !feature.properties) return defaultStyle;
                const name = feature.properties.nombre;
                return name === selectedBarrio ? selectedStyle : defaultStyle;
            },
            onEachFeature: onEachFeature,
        });

        // Guardar referencia y añadir al mapa
        geoJsonRef.current = geoJsonLayer;
        geoJsonLayer.addTo(map);

        // Limpiar al desmontar
        return () => {
            map.removeLayer(geoJsonLayer);
        };
    }, [map, onEachFeature, selectedBarrio]);

    return null;
}

export function BarrioMap({ onSelectBarrio, selectedBarrio }: BarrioMapProps) {
    return (
        <div className="rounded-lg overflow-hidden shadow mb-6">
            <MapContainer
                center={[39.4699, -0.3763] as L.LatLngExpression}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSONWithInteractions
                    selectedBarrio={selectedBarrio}
                    onSelectBarrio={onSelectBarrio}
                />
            </MapContainer>
        </div>
    );
}

const groupNeighborhoods = (data: SimulationRow[]) => {
    const result: Record<string, Neighborhood> = {};

    for (const row of data) {
        if (!result[row.barrio]) {
            result[row.barrio] = {
                barrio: row.barrio,
                almacenes_barrio: row.almacenes_barrio,
                comercios_barrio: row.comercios_barrio,
                cids_barrio: row.cids_barrio,
                paquetes: [row.paquetes],
            };
        } else {
            const barrio = result[row.barrio]!;
            if (!barrio.paquetes.includes(row.paquetes)) {
                barrio.paquetes.push(row.paquetes);
            }
        }
    }

    return result;
};

export default function Simulation() {
    console.log("Simulation component rendered");
    // Estados para los selectores
    const [selectedNeighborhood, setSelectedNeighborhood] =
        useState<Neighborhood>({} as Neighborhood);
    const [selectedPackageQty, setSelectedPackageQty] = useState<number>(0);

    // Tipo para simulationResult
    interface SimulationResultType {
        time: number;
        emissions: number;
        cost: number;
    }

    // Estados para datos y filtros
    const [data, setData] = useState<SimulationRow[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<
        Record<string, Neighborhood>
    >({});
    const [predefinedData, setPredefinedData] = useState<PredefinedSelection>({
        M1: null,
        M2: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [simulationResult, setSimulationResult] =
        useState<SimulationResultType | null>(null);
    const [noDataFound, setNoDataFound] = useState(false);

    // Cargar datos del CSV
    useEffect(() => {
        setIsLoading(true);
        console.log("Fetching CSV data...");

        fetch("/results_simulations_agrupado.csv")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.text();
            })
            .then(async (csv) => {
                console.log("CSV fetched, length:", csv.length);
                console.log(
                    "Contenido bruto del CSV (primeros 300 caracteres):"
                );
                console.log(csv.slice(0, 300));

                const { data } = Papa.parse<SimulationRow>(csv, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: ",",
                    dynamicTyping: true,
                    transform: (value, field: string) => {
                        if (["barrio", "modelo"].includes(field)) {
                            return value.trim();
                        }
                        return value;
                    },
                });

                const validData = data.filter(
                    (row) => row.barrio && row.modelo && !isNaN(row.paquetes)
                );
                setData(validData);

                setNeighborhoods(groupNeighborhoods(validData));

                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error loading CSV:", error);
                setIsLoading(false);
            });
    }, []);

    // Filtrar datos cuando cambian las selecciones
    useEffect(() => {
        if (selectedNeighborhood && selectedPackageQty && data.length > 0) {
            const filtered = data.filter(
                (row) =>
                    row.barrio === selectedNeighborhood.barrio &&
                    row.paquetes === selectedPackageQty
            );
            const m1 = filtered.find((row) => row.modelo === "M1") || null;
            const m2 = filtered.find((row) => row.modelo === "M2") || null;

            setPredefinedData({
                M1: m1,
                M2: m2,
            });
            console.log("🔍 Resultado filtrado:", filtered);

            setNoDataFound(!filtered);
        } else {
            setPredefinedData({ M1: null, M2: null });
            setNoDataFound(false);
        }
    }, [selectedNeighborhood, selectedPackageQty, data]);

    // Animation variants
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    const handleRunSimulation = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simular carga
        setTimeout(() => {
            setIsLoading(false);
            setSimulationResult({
                time: 45,
                emissions: 75,
                cost: 89,
            });
        }, 1500);
    };

    return (
        <div className="page-transition page-active" id="top">
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Delivery Simulation
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Explore different delivery scenarios using our
                            simulation tools.
                        </p>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center bg-white/80 px-3 py-2 rounded-full text-sm text-gray-600">
                                <FaInfo className="text-primary mr-2" />
                                <span>
                                    Comparing delivery methods for urban
                                    environments
                                </span>
                            </div>
                            <Link
                                to="/comparison"
                                className="flex items-center bg-white px-4 py-2 rounded-full text-primary hover:text-white hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <FaChartLine className="mr-2" />
                                <span>View detailed comparison</span>
                            </Link>
                        </div>
                    </div>

                    <Tabs defaultValue="predefined" className="mb-10">
                        <TabsList className="tabs-list">
                            <TabsTrigger
                                value="predefined"
                                className="tab-trigger"
                            >
                                <FaRoute className="mr-2" />
                                Predefined Simulations
                            </TabsTrigger>
                            <TabsTrigger
                                value="interactive"
                                className="tab-trigger"
                            >
                                <FaPlayCircle className="mr-2" />
                                Interactive Simulation
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="predefined" className="tab-content">
                            <div
                                className={`bg-white rounded-lg shadow-md transition-all duration-300 border-l-4 overflow-hidden border-primary hover:shadow-lg hover:transform hover:-translate-y-1 p-6 mb-8`}
                            >
                                <BarrioMap
                                    onSelectBarrio={(name) =>
                                        setSelectedNeighborhood(
                                            neighborhoods[name]
                                        )
                                    }
                                    selectedBarrio={selectedNeighborhood.barrio}
                                />

                                <div className="flex items-center mb-4">
                                    {true ? (
                                        <FaTruck className="text-2xl text-primary mr-3" />
                                    ) : (
                                        <FaRobot className="text-2xl text-secondary mr-3" />
                                    )}
                                    <h2 className="text-xl font-semibold">
                                        Predefined Route Simulations
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Compare traditional delivery vans (M1) with
                                    autonomous robots (M2) across different
                                    neighborhoods and package volumes.
                                </p>

                                {isLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                        <span className="ml-3 text-gray-600">
                                            Loading data...
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-row gap-6 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                                            <div className="flex flex-col gap-6 w-1/2">
                                                <div>
                                                    <label
                                                        htmlFor="neighborhood"
                                                        className="flex items-center text-sm font-medium text-gray-700 mb-2"
                                                    >
                                                        <FaMapMarkerAlt className="text-primary mr-2" />
                                                        Neighborhood
                                                    </label>
                                                    <select
                                                        id="neighborhood"
                                                        value={
                                                            selectedNeighborhood.barrio
                                                        }
                                                        onChange={(
                                                            e: React.ChangeEvent<HTMLSelectElement>
                                                        ) =>
                                                            setSelectedNeighborhood(
                                                                neighborhoods[
                                                                    e.target
                                                                        .value
                                                                ]
                                                            )
                                                        }
                                                        className="interactive-input w-full p-3 bg-white border border-gray-200 rounded-md"
                                                    >
                                                        <option
                                                            key="default-neighborhood"
                                                            value=""
                                                        >
                                                            Select neighborhood
                                                        </option>
                                                        {Object.keys(
                                                            neighborhoods
                                                        ).map((barrio) => (
                                                            <option
                                                                key={barrio}
                                                                value={barrio}
                                                            >
                                                                {barrio}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="packages"
                                                        className="flex items-center text-sm font-medium text-gray-700 mb-2"
                                                    >
                                                        <FaBoxOpen className="text-primary mr-2" />
                                                        Package Volume
                                                    </label>
                                                    <select
                                                        id="packages"
                                                        value={
                                                            selectedPackageQty
                                                        }
                                                        onChange={(
                                                            e: React.ChangeEvent<HTMLSelectElement>
                                                        ) =>
                                                            setSelectedPackageQty(
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                        className="interactive-input w-full p-3 bg-white border border-gray-200 rounded-md"
                                                    >
                                                        <option
                                                            key="default-package"
                                                            value=""
                                                        >
                                                            Select package size
                                                        </option>
                                                        {(selectedNeighborhood?.paquetes
                                                            ? selectedNeighborhood.paquetes
                                                            : []
                                                        ).map((size) => (
                                                            <option
                                                                key={size}
                                                                value={size}
                                                            >
                                                                {size} packages
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-1/2 p-4">
                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                    <FaInfo className="mr-2 text-blue-500" />{" "}
                                                    Neighborhood Information
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="text-center">
                                                        <FaShoppingCart className="text-primary text-3xl mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">
                                                            Stores
                                                        </p>
                                                        <p className="text-lg font-semibold text-gray-800">
                                                            {selectedNeighborhood?.comercios_barrio ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <FaTruck className="text-secondary text-3xl mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">
                                                            Distribution Points
                                                        </p>
                                                        <p className="text-lg font-semibold text-gray-800">
                                                            {selectedNeighborhood?.cids_barrio ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <FaWarehouse className="text-yellow-500 text-3xl mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">
                                                            Warehouses
                                                        </p>
                                                        <p className="text-lg font-semibold text-gray-800">
                                                            {selectedNeighborhood?.almacenes_barrio ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {noDataFound && (
                                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-6 text-center">
                                                <p>
                                                    No data available for this
                                                    selection. Please try a
                                                    different combination.
                                                </p>
                                            </div>
                                        )}

                                        {(predefinedData.M1 ||
                                            predefinedData.M2) && (
                                            <div className="simulation-results">
                                                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                                                    Simulation Results
                                                </h3>
                                                <div className="flex flex-row gap-6">
                                                    <div className="flex flex-col gap-4 model-traditional p-4 rounded-lg shadow-sm border border-gray-100 w-1/2 items-center">
                                                        <motion.div
                                                            className="flex items-center"
                                                            initial={{
                                                                x: -30,
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                x: 0,
                                                                opacity: 1,
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: 0.2,
                                                            }}
                                                        >
                                                            <div className="bg-white p-4 rounded-full mr-5 shadow-lg">
                                                                <FaTruck className="text-3xl text-red-600" />
                                                            </div>
                                                            <div>
                                                                <h2 className="text-3xl font-bold text-white">
                                                                    Traditional
                                                                    Delivery
                                                                </h2>
                                                                <p className="text-blue-100">
                                                                    Human-driven
                                                                    vehicles
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                        <div className="flex flex-col gap-4 mb-6 w-full">
                                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                                    <FaRoute className="mr-2 text-blue-500" />{" "}
                                                                    Distance
                                                                    Metrics
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Walking
                                                                            (km):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1?.total_kms_walk.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Driving
                                                                            (km):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1?.total_kms_drive.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                                                                        <span className="text-sm text-gray-600">
                                                                            Total:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1
                                                                                ? (
                                                                                      predefinedData
                                                                                          .M1
                                                                                          .total_kms_walk +
                                                                                      predefinedData
                                                                                          .M1
                                                                                          .total_kms_drive
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                                : "-"}{" "}
                                                                            km
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                                    <FaClock className="mr-2 text-purple-500" />{" "}
                                                                    Time Metrics
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Walking
                                                                            (hours):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1?.total_hours_walk.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Driving
                                                                            (hours):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1?.total_hours_drive.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                                                                        <span className="text-sm text-gray-600">
                                                                            Total:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1
                                                                                ? (
                                                                                      predefinedData
                                                                                          .M1
                                                                                          .total_hours_walk +
                                                                                      predefinedData
                                                                                          .M1
                                                                                          .total_hours_drive
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                                : "-"}{" "}
                                                                            hours
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="font-medium text-gray-800 flex items-center">
                                                                        <FaMoneyBillWave className="mr-2 text-green-500" />{" "}
                                                                        Cost
                                                                        Metrics
                                                                    </h4>
                                                                    <Link
                                                                        to="/comparison"
                                                                        className="flex items-center text-sm text-primary hover:text-blue-700 transition-colors"
                                                                        title="View detailed cost breakdown"
                                                                    >
                                                                        <FaInfo className="mr-1" />{" "}
                                                                        Detailed
                                                                        costs
                                                                    </Link>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Distance
                                                                            cost:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1?.distance_cost_van.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}{" "}
                                                                            €
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Time
                                                                            cost:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M1?.time_cost_van.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}{" "}
                                                                            €
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                                                                        <span className="text-sm text-gray-600">
                                                                            Total
                                                                            cost:
                                                                        </span>
                                                                        <span className="font-bold text-lg">
                                                                            {predefinedData.M1?.total_cost.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}{" "}
                                                                            €
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-4 model-autonomous p-4 rounded-lg shadow-sm border border-gray-100 w-1/2 items-center">
                                                        <motion.div
                                                            className="flex items-center"
                                                            initial={{
                                                                x: 30,
                                                                opacity: 0,
                                                            }}
                                                            animate={{
                                                                x: 0,
                                                                opacity: 1,
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: 0.2,
                                                            }}
                                                        >
                                                            <div className="bg-white p-4 rounded-full mr-5 shadow-lg">
                                                                <FaRobot className="text-3xl text-green-600" />
                                                            </div>
                                                            <div>
                                                                <h2 className="text-3xl font-bold text-white">
                                                                    Autonomous
                                                                    Delivery
                                                                </h2>
                                                                <p className="text-purple-100">
                                                                    AI-powered
                                                                    robots
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                        <div className="flex flex-col gap-4 mb-6 w-full">
                                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                                    <FaRoute className="mr-2 text-blue-500" />{" "}
                                                                    Distance
                                                                    Metrics
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Walking
                                                                            (km):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2?.total_kms_walk.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Driving
                                                                            (km):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2?.total_kms_drive.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                                                                        <span className="text-sm text-gray-600">
                                                                            Total:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2
                                                                                ? (
                                                                                      predefinedData
                                                                                          .M2
                                                                                          .total_kms_walk +
                                                                                      predefinedData
                                                                                          .M2
                                                                                          .total_kms_drive
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                                : "-"}{" "}
                                                                            km
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                                                                    <FaClock className="mr-2 text-purple-500" />{" "}
                                                                    Time Metrics
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Walking
                                                                            (hours):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2?.total_hours_walk.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Driving
                                                                            (hours):
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2?.total_hours_drive.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                                                                        <span className="text-sm text-gray-600">
                                                                            Total:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2
                                                                                ? (
                                                                                      predefinedData
                                                                                          .M2
                                                                                          .total_hours_walk +
                                                                                      predefinedData
                                                                                          .M2
                                                                                          .total_hours_drive
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                                : "-"}{" "}
                                                                            hours
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="font-medium text-gray-800 flex items-center">
                                                                        <FaMoneyBillWave className="mr-2 text-green-500" />{" "}
                                                                        Cost
                                                                        Metrics
                                                                    </h4>
                                                                    <Link
                                                                        to="/comparison"
                                                                        className="flex items-center text-sm text-primary hover:text-blue-700 transition-colors"
                                                                        title="View detailed cost breakdown"
                                                                    >
                                                                        <FaInfo className="mr-1" />{" "}
                                                                        Detailed
                                                                        costs
                                                                    </Link>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Distance
                                                                            cost:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2?.distance_cost_ona.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}{" "}
                                                                            €
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-gray-600">
                                                                            Time
                                                                            cost:
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {predefinedData.M2?.time_cost_ona.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}{" "}
                                                                            €
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                                                                        <span className="text-sm text-gray-600">
                                                                            Total
                                                                            cost:
                                                                        </span>
                                                                        <span className="font-bold text-lg">
                                                                            {predefinedData.M2?.total_cost.toFixed(
                                                                                2
                                                                            ) ||
                                                                                "-"}{" "}
                                                                            €
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="interactive"
                            className="tab-content"
                        >
                            <div className="simulation-card p-6 mb-8 bg-gradient-to-br from-gray-50 to-white">
                                <div className="flex items-center mb-4">
                                    <FaPlayCircle className="text-2xl text-secondary mr-3" />
                                    <h2 className="text-xl font-semibold">
                                        Interactive Simulation
                                    </h2>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Configure your own delivery scenario by
                                    adjusting the parameters below and see the
                                    estimated results.
                                </p>

                                <form
                                    onSubmit={handleRunSimulation}
                                    className="mb-8"
                                >
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                            <label
                                                htmlFor="interactive-neighborhood"
                                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                                            >
                                                <FaMapMarkerAlt className="text-secondary mr-2" />
                                                Neighborhood
                                            </label>
                                            <select
                                                id="interactive-neighborhood"
                                                className="interactive-input w-full p-3 bg-white"
                                            >
                                                <option
                                                    key="Centro"
                                                    value="Centro"
                                                >
                                                    Centro
                                                </option>
                                                <option
                                                    key="Malasaña"
                                                    value="Malasaña"
                                                >
                                                    Malasaña
                                                </option>
                                                <option
                                                    key="Chamberí"
                                                    value="Chamberí"
                                                >
                                                    Chamberí
                                                </option>
                                                <option
                                                    key="Salamanca"
                                                    value="Salamanca"
                                                >
                                                    Salamanca
                                                </option>
                                            </select>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                            <label
                                                htmlFor="interactive-packages"
                                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                                            >
                                                <FaBoxOpen className="text-secondary mr-2" />
                                                Number of Packages
                                            </label>
                                            <input
                                                type="number"
                                                id="interactive-packages"
                                                min="1"
                                                max="50"
                                                defaultValue="10"
                                                className="interactive-input w-full p-3 bg-white"
                                            />
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                            <label
                                                htmlFor="interactive-distance"
                                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                                            >
                                                <FaRoute className="text-secondary mr-2" />
                                                Total Route Distance (km)
                                            </label>
                                            <input
                                                type="number"
                                                id="interactive-distance"
                                                min="1"
                                                max="20"
                                                step="0.5"
                                                defaultValue="5"
                                                className="interactive-input w-full p-3 bg-white"
                                            />
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                            <label
                                                htmlFor="interactive-traffic"
                                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                                            >
                                                <FaTrafficLight className="text-secondary mr-2" />
                                                Traffic Conditions
                                            </label>
                                            <select
                                                id="interactive-traffic"
                                                className="interactive-input w-full p-3 bg-white"
                                            >
                                                <option key="low" value="low">
                                                    Low
                                                </option>
                                                <option
                                                    key="medium"
                                                    value="medium"
                                                >
                                                    Medium
                                                </option>
                                                <option key="high" value="high">
                                                    High
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="submit-button px-6 py-3 bg-secondary text-white rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex items-center shadow-md"
                                        >
                                            <FaPlayCircle className="mr-2" />
                                            {isLoading
                                                ? "Processing..."
                                                : "Run Simulation"}
                                        </button>
                                    </div>
                                </form>

                                {isLoading && (
                                    <div className="text-center py-6">
                                        <div className="inline-block w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="mt-3 text-gray-600">
                                            Calculating results...
                                        </p>
                                    </div>
                                )}

                                {!isLoading && !simulationResult && (
                                    <div className="text-center bg-blue-50 p-8 rounded-lg border border-blue-100">
                                        <FaChartLine className="text-primary text-4xl mx-auto mb-4 opacity-50" />
                                        <p className="text-gray-600">
                                            Complete the form and click "Run
                                            Simulation" to see the results.
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            (This is a demonstration - actual
                                            API connection will be implemented
                                            in the final version)
                                        </p>
                                    </div>
                                )}

                                {!isLoading && simulationResult && (
                                    <div className="mt-8 border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold mb-4 text-center">
                                            Simulation Results
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 text-center shadow-sm">
                                                <FaClock className="text-primary text-2xl mx-auto mb-2" />
                                                <div className="text-sm text-gray-500 mb-1">
                                                    Delivery Time
                                                </div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {simulationResult.time} min
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-5 rounded-lg border border-green-100 text-center shadow-sm">
                                                <FaLeaf className="text-green-500 text-2xl mx-auto mb-2" />
                                                <div className="text-sm text-gray-500 mb-1">
                                                    CO2 Emissions
                                                </div>
                                                <div className="text-2xl font-bold text-green-500">
                                                    {simulationResult.emissions}{" "}
                                                    g
                                                </div>
                                            </div>
                                            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100 text-center shadow-sm">
                                                <FaMoneyBillWave className="text-yellow-500 text-2xl mx-auto mb-2" />
                                                <div className="text-sm text-gray-500 mb-1">
                                                    Operational Cost
                                                </div>
                                                <div className="text-2xl font-bold text-yellow-500">
                                                    {simulationResult.cost} €
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </motion.div>
        </div>
    );
}
