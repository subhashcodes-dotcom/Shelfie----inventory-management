
# SHELFIE-Inventory
### Smart Inventory Management Using Python and Data Science

SHELFIE-Inventory is a data-driven inventory management web application designed to help businesses monitor stock, analyse sales, forecast product demand, identify unusual inventory patterns, and make better replenishment decisions.

The project combines a Flask web application, SQLite database, data analysis, and machine-learning models to turn inventory and sales data into practical insights.

> **Project type:** Data Science + Machine Learning + Web Development  
> **Primary language:** Python  
> **Framework:** Flask  
> **Database:** SQLite

---

## 1. Problem Statement

Traditional inventory management often relies on manual calculations and fixed stock thresholds. This can result in stockouts, overstocking, excess storage costs, and difficulty identifying slow-moving products.

SHELFIE-Inventory aims to improve this process by combining inventory records with historical sales analysis and demand forecasting.

The system helps users understand:
- What products are currently available?
- Which products are selling quickly?
- Which products may require replenishment?
- How much demand might occur over the next seven days?
- How much stock should be ordered after considering existing and incoming inventory?
- Which products or sales observations require further investigation?

## 2. Objectives

- Maintain product and inventory records.
- Track sales, purchases, suppliers, and stock movements.
- Perform Exploratory Data Analysis (EDA).
- Prepare historical sales data for machine learning.
- Forecast product demand using a Random Forest Regressor.
- Compare different regression models.
- Identify unusual observations using Isolation Forest.
- Calculate suggested reorder quantities.
- Provide visual analytics and inventory insights through a web interface.
- Support better, data-informed inventory decisions.

## 3. Main Features

### Inventory Management
- Product catalogue and product variants.
- Stock quantity monitoring.
- Low-stock thresholds.
- Sales and purchase records.
- Incoming stock tracking.
- Inventory adjustments and stock movement history.

### Data Science and Analytics
- Sales and demand analysis.
- Product and category performance.
- Daily, weekly, and monthly trends.
- Slow-moving inventory analysis.
- Supplier-related insights.
- Stock and demand comparisons.
- EDA charts and visualisations.

### Machine Learning
- Seven-day demand estimation.
- Random Forest regression.
- Regression model comparison.
- Evaluation using MAE, RMSE, and R².
- Isolation Forest anomaly model.
- Suggested replenishment quantities based on demand and stock information.

### Web Application
- Flask-based interface.
- SQLite database.
- HTML, CSS, and JavaScript front end.
- Role-aware workflows where configured.
- Inventory summaries and decision-support information.

---

## 4. Technology Stack

| Technology | Purpose |
|---|---|
| Python | Main programming language |
| Flask | Web application and routing |
| SQLite | Database storage |
| Pandas | Data cleaning, grouping, and processing |
| NumPy | Numerical calculations |
| Scikit-learn | Machine-learning models and evaluation |
| Joblib | Saving and loading trained models |
| Matplotlib | EDA charts |
| HTML | Page structure |
| CSS | User interface styling |
| JavaScript | Browser-side interactions |

---

## 5. System Architecture

```text
Historical Sales Data + Inventory Records
                  |
                  v
           SQLite Database
                  |
                  v
       Data Extraction Using Pandas
                  |
                  v
        Data Cleaning and Processing
                  |
                  v
          Feature Engineering
                  |
                  v
        Random Forest Regressor
                  |
                  v
       Seven-Day Demand Prediction
                  |
                  v
 Current Stock + Incoming Stock + Safety Stock
                  |
                  v
       Reorder Quantity Calculation
                  |
                  v
       Flask Web Application
                  |
                  v
       Insights, Charts and Alerts
```

### How It Works

1. Product, sales, and inventory data are stored in the database.
2. Historical sales records are extracted and processed.
3. Sales quantities are grouped by date and product variant.
4. Calendar and previous-demand features are created.
5. The forecasting model is trained using historical observations.
6. The trained model is saved for later use.
7. Predictions estimate future demand.
8. The recommendation logic considers demand, available stock, incoming stock, and safety stock.
9. Results are displayed through the application for users to review.

---

## 6. Machine-Learning Models Used

### A. Random Forest Regressor

**Purpose:** Forecast product demand using historical sales and time-related features.

Random Forest is an ensemble-learning algorithm that combines predictions from multiple decision trees.

Each tree learns patterns from the training data. Their predictions are combined to produce the final regression prediction.

**Why it is used:**
- Can learn nonlinear relationships.
- Handles interactions between multiple features.
- Usually requires little feature scaling.
- Provides a useful baseline for structured sales data.
- Can capture some patterns in recent demand and calendar information.

#### Configured Hyperparameters

| Parameter | Value | Explanation |
|---|---:|---|
| `n_estimators` | 160 | Number of decision trees |
| `max_depth` | 10 | Maximum depth of each tree |
| `min_samples_leaf` | 2 | Minimum samples in a leaf |
| `random_state` | 42 | Supports reproducibility |
| `n_jobs` | -1 | Uses available CPU cores where supported |

#### Input Features

The model uses seven features:

| Feature | Explanation |
|---|---|
| `dow` | Day of the week |
| `month` | Calendar month |
| `dayofmonth` | Day number in the month |
| `weekofyear` | ISO week number |
| `lag1` | Previous day's sales quantity |
| `lag7` | Sales quantity seven days earlier |
| `roll7` | Average demand over the previous seven days |

**Target variable:** `qty`, representing the daily quantity sold for a product variant.

The model predicts daily demand. The application uses the daily prediction to estimate demand across a seven-day horizon.

### B. Isolation Forest

**Purpose:** Identify observations that differ significantly from typical observations.

Isolation Forest is an unsupervised anomaly-detection algorithm. It isolates observations using random partitions. Unusual observations may be isolated more quickly than typical ones.

The current model configuration uses:
- `contamination=0.05`
- `random_state=42`

The saved anomaly model is trained using the quantity (`qty`) column.

**Important:** An anomaly is not automatically an error or fraud. It is a signal that an observation may need investigation. The model should not be described as a fully validated real-time anomaly alert system unless that complete workflow has been tested.

### C. Regression Models Compared

The project compares four regression algorithms:

1. **Linear Regression:** Provides a simple linear baseline.
2. **Decision Tree Regressor:** Learns decision rules from feature values.
3. **Random Forest Regressor:** Combines multiple decision trees.
4. **Gradient Boosting Regressor:** Builds trees sequentially to improve predictions.

The models are evaluated using the same prepared features and chronological hold-out split.

Random Forest is used in the demand-forecasting workflow. The actual evaluation results should determine whether it performs well on the available data.

---

## 7. How the Model Is Trained

The model-training workflow is implemented in `model.py`.

### Step 1: Collect Historical Data

Historical sales information is retrieved from the SQLite database.

Cancelled and failed orders are excluded from demand calculations.

### Step 2: Prepare the Data

Pandas is used to:
- Parse order dates.
- Group sales quantities by date and product variant.
- Organise demand chronologically.
- Create a continuous daily series.
- Fill missing dates with zero recorded demand.

A missing transaction is treated as zero demand in this implementation. In real-world systems, missing data must be distinguished from store closures, stockouts, and incomplete records.

### Step 3: Feature Engineering

Seven features are prepared:
- Day of week
- Month
- Day of month
- Week of year
- Previous day's demand
- Demand seven days earlier
- Seven-day rolling average

Lag and rolling features help the model learn from recent sales patterns.

### Step 4: Select the Target

The target variable is `qty`, which represents the quantity sold on a particular day for a product variant.

### Step 5: Split the Dataset

The implementation uses an 80/20 chronological split.

- **Training data:** Earlier observations used to learn patterns.
- **Testing data:** Later observations used to evaluate predictions.

A time-ordered split is appropriate for forecasting because future observations should not be used to train a model that is evaluated on the past.

### Step 6: Train the Model

The Random Forest Regressor learns relationships between the seven input features and the target quantity.

The model creates multiple decision trees and combines their predictions.

### Step 7: Evaluate the Model

Predictions are compared with actual test-set quantities using MAE, RMSE, and R².

### Step 8: Save the Model

The trained model is saved using Joblib so that the application can load it without retraining for every prediction.

Typical model artefacts include:

- `models/demand_model.joblib`
- `models/anomaly_model.joblib`
- `models/metrics.json`

### Step 9: Generate Predictions

The application uses recent demand information and calendar features to estimate future daily demand, then uses that estimate in its replenishment calculations.

---

## 8. Model Evaluation Metrics

### Mean Absolute Error (MAE)

MAE measures the average absolute difference between actual and predicted values.

Lower MAE generally means predictions are closer to the actual values.

### Root Mean Squared Error (RMSE)

RMSE calculates the square root of the average squared prediction errors.

Large errors receive greater penalties than they do under MAE.

### R² Score

R² measures predictive performance relative to a baseline that predicts the target mean.

- A score closer to 1 indicates stronger performance.
- A score near 0 indicates performance similar to the mean baseline under the evaluation setup.
- A negative score means the model performs worse than that baseline on the evaluated data.

**Current project note:** The saved evaluation result has an R² of approximately `-0.012`. This indicates that the current model has not demonstrated useful predictive performance against the mean baseline on that test set.

The model is therefore a working forecasting prototype, not proof of highly accurate demand prediction. Improving data quality, adding relevant features, and validating against simple forecasting baselines are important next steps.

---

## 9. Reorder Recommendation Logic

The purpose of the recommendation engine is to estimate whether additional stock may be needed.

The general replenishment formula is:

```text
Suggested Order Quantity =
max(0, Forecast Demand + Safety Stock
       - Current Stock - Incoming Stock)
```

Where:

- **Forecast Demand:** Expected demand during the planning horizon.
- **Safety Stock:** Additional quantity reserved to reduce stockout risk.
- **Current Stock:** Quantity currently available.
- **Incoming Stock:** Quantity already ordered and expected to arrive.
- **Suggested Order Quantity:** Additional quantity suggested for replenishment.

### Example

Suppose a product has:

- Forecast demand: 50 units
- Safety stock: 10 units
- Current stock: 20 units
- Incoming stock: 5 units

Calculation:

```text
Suggested Order = max(0, 50 + 10 - 20 - 5)
                = max(0, 35)
                = 35 units
```

The suggested order quantity is **35 units**.

This is an illustrative example, not a live prediction from the application.

The result should be reviewed against supplier lead time, minimum order quantities, storage capacity, and business requirements before purchasing.

---

## 10. Exploratory Data Analysis (EDA)

Exploratory Data Analysis helps understand the dataset before drawing conclusions or training a model.

EDA may be used to investigate:

- Product and category sales.
- Sales trends over time.
- Demand distributions.
- Stock availability.
- Top-selling and slow-moving products.
- Supplier fulfilment patterns.
- Relationships between numeric variables.
- Potential outliers and unusual observations.

Matplotlib is used to generate visualisations. The project includes scripts and generated assets for analysis.

EDA is important because it helps identify data-quality issues, understand patterns, and choose suitable modelling features.

---

## 11. Project Structure

The exact files may vary slightly by project version.

```text
SHELFIE-Inventory/
│
├── app.py
├── model.py
├── bootstrap_db.py
├── generate_eda_assets.py
├── inventory.db
├── requirements.txt
├── README.md
│
├── data/
│   └── CSV datasets
│
├── models/
│   ├── demand_model.joblib
│   ├── anomaly_model.joblib
│   └── metrics.json
│
├── templates/
│   └── HTML templates
│
├── static/
│   └── CSS, JavaScript, images and charts
│
└── docs/
    └── Project documentation
```

### Important Files

| File | Responsibility |
|---|---|
| `app.py` | Flask application and web workflows |
| `model.py` | Data preparation, training, evaluation, and prediction logic |
| `bootstrap_db.py` | Database initialisation and data import |
| `generate_eda_assets.py` | EDA chart generation |
| `requirements.txt` | Python dependencies |
| `inventory.db` | SQLite database, if included |
| `models/` | Saved machine-learning artefacts |

---

## 12. Installation and Execution

### Prerequisites

- Python installed on your computer.
- Git, if cloning the repository.
- A terminal or Command Prompt.

### Step 1: Clone the Repository

```bash
git clone https://github.com/subhashcodes-dotcom/Shelfie----inventory-management.git
cd Shelfie----inventory-management
```

### Step 2: Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Initialise the Database

If the project setup requires database initialisation or CSV import, run:

```bash
python bootstrap_db.py
```

Check the script's instructions before rerunning it against an existing database, because an initialisation script may recreate or modify data.

### Step 5: Start the Application

```bash
python app.py
```

Open the local address displayed in the terminal, commonly:

```text
http://127.0.0.1:5000
```

Use the actual address and port printed by Flask if they differ.

---

## 13. Retraining and Regenerating EDA

### Retrain the Models

Inspect `model.py` for the training entry point and follow the script's supported execution instructions. The training process should generate or update the model artefacts and metrics.

Do not assume the saved model has been retrained merely because the application starts successfully.

### Regenerate EDA Assets

If supported by the script's current configuration, run:

```bash
python generate_eda_assets.py
```

Check the output for the locations of the generated charts.

---

## 14. Database Overview

SQLite provides persistent local storage for application data.

Depending on the configured schema, the database may contain records for:
- Products and variants.
- Users and roles.
- Sales orders and order items.
- Suppliers.
- Purchase orders.
- Inventory and stock movements.
- Customers and related operational records.

The actual table names and relationships should be verified in the database initialisation script and schema before presenting them as a definitive database design.

---

## 15. Example End-to-End Workflow

1. The application loads product and stock information.
2. A user reviews sales and inventory analytics.
3. Historical demand data is processed into daily observations.
4. The saved forecasting model estimates daily demand.
5. The demand estimate is used to calculate a seven-day requirement.
6. The recommendation logic accounts for current stock and incoming quantities.
7. A suggested replenishment quantity is presented.
8. The user checks the recommendation and makes the final business decision.

This workflow combines conventional inventory rules with machine-learning predictions.

---

## 16. Testing and Troubleshooting

### Python Is Not Recognised

Check installation:

```bash
python --version
```

If unavailable, install Python and ensure it is added to PATH.

### Missing Python Packages

Run:

```bash
pip install -r requirements.txt
```

### Database Errors

Check that the SQLite database exists and that the database setup procedure has completed successfully.

### Model File Not Found

Check that the expected files exist in `models/` and that the configured paths match the project directory.

### Port Already in Use

Stop the other process using the port or configure Flask to use a different available port.

### Poor Forecasting Metrics

Check:
- Number of historical observations.
- Missing and duplicate transactions.
- Demand variation across products.
- Feature preparation and lag calculations.
- Chronological train/test split.
- Performance against a simple baseline.

---

## 17. Limitations

- Forecast quality depends on the quantity and quality of historical data.
- A negative R² indicates that the current evaluation does not demonstrate useful performance over the mean baseline.
- Missing transaction dates are treated as zero demand, which may not always be correct.
- The current features do not fully represent promotions, holidays, price changes, supplier delays, or stockout-constrained sales.
- Isolation Forest flags unusual observations but does not explain their causes.
- Reorder recommendations depend on the quality of forecasts, safety-stock assumptions, and incoming-stock information.
- The application should be treated as a decision-support prototype until it has been thoroughly tested in a real operational environment.

---

## 18. Future Enhancements

- Add more historical data and improve data-quality validation.
- Include promotions, holidays, price changes, and supplier lead times as features.
- Compare the model with seasonal-naive and moving-average baselines.
- Use walk-forward validation and tune model hyperparameters.
- Evaluate performance separately for high-volume and low-volume products.
- Improve safety-stock calculations using demand variability and lead-time uncertainty.
- Add automated tests and model monitoring.
- Improve security, audit logging, and production deployment configuration.
- Validate recommendations with real inventory users before automating purchases.

---

## 19. Quick Presentation Script

"SHELFIE-Inventory is a smart inventory management system developed using Python, Flask, SQLite, and Data Science.

Traditional inventory systems mainly track stock quantities. Our project extends this by analysing historical sales, visualising demand patterns, and using machine learning to estimate future product demand.

We use a Random Forest Regressor for demand forecasting. The model takes seven features, including calendar information and recent sales history. We also compare Linear Regression, Decision Tree, Random Forest, and Gradient Boosting models using MAE, RMSE, and R².

An Isolation Forest model is included for identifying unusual quantity observations.

The demand estimate is combined with current stock, incoming stock, and safety stock to calculate a suggested reorder quantity. The results are displayed through a Flask web application backed by SQLite.

The project demonstrates how data analysis, machine learning, and inventory rules can support more informed replenishment decisions. The current model still needs improvement and further validation before production use."

---

## 20. Viva Questions and Answers

**1. What is SHELFIE-Inventory?**

A Python-based inventory management application combining stock operations, data analysis, demand forecasting, and replenishment recommendations.

**2. Why did you choose Python?**

Python offers useful libraries for data processing, machine learning, visualisation, and web development.

**3. What is Flask?**

Flask is a lightweight Python web framework used to build the application's web interface and backend routes.

**4. Why SQLite?**

SQLite is a lightweight relational database that stores application records without requiring a separate database server.

**5. What is EDA?**

Exploratory Data Analysis is the process of examining and visualising data to understand distributions, trends, relationships, and quality issues.

**6. Which model forecasts demand?**

Random Forest Regressor.

**7. Why Random Forest?**

It combines multiple decision trees and can learn nonlinear relationships in structured data.

**8. What is the target variable?**

`qty`, representing the daily sales quantity for a product variant.

**9. What are lag features?**

Features that use earlier observations, such as yesterday's demand (`lag1`) or demand seven days earlier (`lag7`).

**10. What is a rolling feature?**

A summary of recent observations. Here, `roll7` represents the mean demand over the previous seven days.

**11. Why use a chronological split?**

Forecasting should be evaluated on later observations while training uses earlier observations, avoiding an unrealistic random ordering of time.

**12. What is MAE?**

Mean Absolute Error: the average absolute difference between actual and predicted quantities.

**13. What is RMSE?**

Root Mean Squared Error: a metric that penalises larger prediction errors more heavily.

**14. What does negative R² mean?**

On the evaluated test set, the model performed worse than the mean-prediction baseline.

**15. What is Isolation Forest?**

An unsupervised anomaly-detection algorithm that identifies observations that can be isolated unusually quickly.

**16. Does an anomaly always mean fraud?**

No. It means the observation differs from the learned pattern and may require investigation.

**17. How is reorder quantity calculated?**

Forecast demand plus safety stock, minus current stock and incoming stock, with the result limited to a minimum of zero.

**18. Is the project fully autonomous?**

No. It provides decision support. Users should review recommendations before making purchasing decisions.

---

## 21. Conclusion

SHELFIE-Inventory demonstrates the integration of web development, database management, exploratory data analysis, and machine learning in an inventory-management use case.

By combining historical sales insights with demand estimates and replenishment rules, the application provides a foundation for more informed stock decisions.

The next stage is to improve forecasting performance, validate recommendations against real operational data, and strengthen the application for reliable deployment.

---

## Security Note

- Never commit passwords, API keys, secret keys, or private credentials.
- Use environment variables for sensitive configuration.
- Use secure password hashing and appropriate access controls.
- Review database files and sample datasets before publishing.
- Do not use the prototype as the sole basis for financial or purchasing decisions without validation.
