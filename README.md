# Delivetter – Simulation Notebooks

This repository contains the Jupyter notebooks used to process geospatial data and simulate delivery scenarios for **Delivetter**, comparing the performance of traditional van-based delivery versus an autonomous robot named **Ona**.

The notebooks are organized into modules for data preprocessing, simulation logic, and model-specific analyses. All simulations aim to support decision-making by providing cost and time estimates under varying delivery conditions.

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

## 📆 Notes

* Ensure all required GeoJSON input files are placed in the appropriate `data/input/` directory.
* If using APIs (e.g., Catastro), verify connectivity and configuration beforehand.
