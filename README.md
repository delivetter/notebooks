# Delivetter – Simulation Notebooks

This repository contains the Jupyter notebooks used to process geospatial data and simulate delivery scenarios for **Delivetter**, comparing the performance of traditional van-based delivery versus an autonomous robot named **Ona**.

The notebooks are organized into modules for data preprocessing, simulation logic, and model-specific analyses. All simulations aim to support decision-making by providing cost and time estimates under varying delivery conditions.

## 🔧 Modules Overview

### Data Processing

* **neighborhood\_filter.ipynb**: Filters and preprocesses neighborhood boundaries to reduce the simulation scope.
* **pycatastro\_api.ipynb**: Extracts and formats parcel/building data from Catastro services.

### Simulation Logic

* **simulation.ipynb**: Combines results from different delivery models into a unified, minable view that can be analyzed or exported.

### Delivery Models

* **M1.ipynb**: Implements simulation logic for Model 1, representing a van-based delivery strategy.
* **M2.ipynb**: Simulates Model 2, which uses the autonomous robot **Ona**.

## ✅ Usage

1. Clone this repository:

   ```bash
   git clone https://github.com/your-org/delivetter-notebooks.git
   cd delivetter-notebooks
   ```

2. Set up a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt  # If provided
   ```

3. Launch Jupyter Lab or Notebook:

   ```bash
   jupyter lab
   ```

4. Run the notebooks in the following order:

   * `data_processing/pycatastro_api.ipynb`
   * `data_processing/neighborhood_filter.ipynb`
   * `models/M1.ipynb` and/or `models/M2.ipynb`
   * `minable_view/simulation.ipynb`

## 📃 Output

The final simulation results will be saved to a CSV file, which can be used for visualization or integrated into other tools such as the Delivetter frontend.

## 📆 Notes

* Ensure all required GeoJSON input files are placed in the appropriate `data/input/` directory.
* If using APIs (e.g., Catastro), verify connectivity and configuration beforehand.