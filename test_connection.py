from app import app, db

def test_connection():
    with app.app_context():  # Cria um contexto de aplicação
        try:
            print("Testing database connection...")
            db.engine.connect()
            print("Database connection successful!")
        except Exception as e:
            print(f"Database connection failed: {e}")

if __name__ == "__main__":
    test_connection()