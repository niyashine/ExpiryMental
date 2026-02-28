from flask import Blueprint, request, jsonify
import requests
from datetime import datetime, timedelta, date

# --------------------
# Blueprint
# --------------------
food_bp = Blueprint("food", __name__)

# --------------------
# Add Food
# --------------------
@food_bp.route("/foods", methods=["POST"])
def add_food():
    from app import db  # import here to avoid circular import
    data = request.get_json()

    name = data["name"]
    quantity = data["quantity"]
    expiry_date = data["expiry_date"]
    barcode = data.get("barcode", None)
    

    cursor = db.cursor()
    query = """
        INSERT INTO foods (name, quantity, expiry_date, barcode, status)
        VALUES (%s, %s, %s, %s, 'active')
    """
    cursor.execute(query, (name, quantity, expiry_date, barcode))
    db.commit()
    cursor.close()

    return jsonify({"message": "Food added successfully"}), 201

# --------------------
# Get all Food
# --------------------
@food_bp.route("/foods", methods=["GET"])
def get_foods():
    from app import db
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM foods")
    foods = cursor.fetchall()
    cursor.close()
    return jsonify(foods), 200

# --------------------
# Mark Food as Used
# --------------------
@food_bp.route("/foods/use/<int:id>", methods=["PUT"])
def use_food(id):
    from app import db
    cursor = db.cursor()
    cursor.execute(
        "UPDATE foods SET status='used' WHERE id=%s",
        (id,)
    )
    db.commit()
    cursor.close()
    return jsonify({"message": "Food marked as used"}), 200

# --------------------
# Update Food
# --------------------
@food_bp.route("/foods/<int:id>", methods=["PUT"])
def update_food(id):
    from app import db
    data = request.get_json()
    name = data["name"]
    quantity = data["quantity"]
    expiry_date = data["expiry_date"]

    cursor = db.cursor()
    query = """
        UPDATE foods 
        SET name=%s, quantity=%s, expiry_date=%s 
        WHERE id=%s
    """
    cursor.execute(query, (name, quantity, expiry_date, id))
    db.commit()
    cursor.close()
    return jsonify({"message": "Food updated successfully"}), 200

# --------------------
# Shelf Status
# --------------------
@food_bp.route("/foods/shelf", methods=["GET"])
def get_shelf():
    from app import db
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM foods WHERE status='active'")
    foods = cursor.fetchall()
    cursor.close()

    today = date.today()
    expiring_soon = []
    fresh_stock = []
    expired = []

    for item in foods:
        if isinstance(item["expiry_date"], datetime):
            expiry_date = item["expiry_date"].date()
        else:
            expiry_date = item["expiry_date"]

        days_left = (expiry_date - today).days

        if days_left < 0:
            expired.append(item)
        elif days_left <= 3:
            expiring_soon.append(item)
        else:
            fresh_stock.append(item)

    return jsonify({
        "expiring_soon": expiring_soon,
        "fresh_stock": fresh_stock,
        "expired": expired
    })

# --------------------
# Scan Food (QuaggaJS)
# --------------------
@food_bp.route('/foods/scan', methods=['POST'])
def scan_food():
    from app import db
    data = request.get_json()
    barcode = data.get('barcode')

    cursor = db.cursor(dictionary=True)

    # 1️⃣ Check if barcode already exists and is active
    cursor.execute("SELECT * FROM foods WHERE barcode=%s AND status='fresh_stock'", (barcode,))
    existing_item = cursor.fetchone()

    if existing_item:
        # 2️⃣ If exists, increment quantity
        new_quantity = existing_item['quantity'] + 1
        cursor.execute(
            "UPDATE foods SET quantity=%s WHERE id=%s",
            (new_quantity, existing_item['id'])
        )
        db.commit()
        cursor.close()
        return jsonify({
            "message": "Existing product updated",
            "id": existing_item['id'],
            "name": existing_item['name'],
            "expiry_date": existing_item['expiry_date'],
            "barcode": barcode,
            "quantity": new_quantity
        })

    # 3️⃣ If not exists, query Open Food Facts
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        r = requests.get(url, timeout=5)
        product_data = r.json()
    except Exception as e:
        cursor.close()
        return jsonify({"error": f"Failed to fetch product info: {str(e)}"}), 500

    if product_data.get("status") == 1:
        name = product_data["product"].get("product_name", "Unknown Product")
    else:
        name = "Unknown Product"

    expiry_date = (datetime.today() + timedelta(days=7)).strftime("%Y-%m-%d")

    # 4️⃣ Insert new item
    cursor.execute(
        "INSERT INTO foods (name, quantity, expiry_date, barcode, status) VALUES (%s,%s,%s,%s,%s)",
        (name, 1, expiry_date, barcode, "fresh_stock")
    )
    db.commit()
    food_id = cursor.lastrowid
    cursor.close()

    return jsonify({
        "id": food_id,
        "name": name,
        "expiry_date": expiry_date,
        "barcode": barcode,
        "quantity": 1
    })