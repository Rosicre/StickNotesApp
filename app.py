from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
from datetime import datetime

# Carregar as variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__)

# Carregar as configurações do arquivo config.py
app.config.from_object('config.Config')

# Carregar a URL do banco de dados diretamente da variável de ambiente
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://root:root@localhost:5432/notas_adesivas')

print("DATABASE_URL:", os.getenv('DATABASE_URL'))  # Verifica se a variável está sendo carregada corretamente

# Impedir que o SQLAlchemy adicione automaticamente um sinalizador de modificações de banco de dados
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializando o banco de dados e a migração
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Modelo da Nota
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_notes', methods=['GET'])
def get_notes():
    try:
        notes = Note.query.all()
        return jsonify([{"id": note.id, "content": note.content, "category": note.category, "created_at": note.created_at, "updated_at": note.updated_at} for note in notes])
    except Exception as e:
        return jsonify({"error": "Erro ao buscar notas", "message": str(e)}), 500

@app.route('/add_note', methods=['POST'])
def add_note():
    try:
        data = request.json
        if not data or "content" not in data or "category" not in data:
            return jsonify({"error": "Dados inválidos"}), 400
        
        new_note = Note(content=data["content"], category=data["category"])
        db.session.add(new_note)
        db.session.commit()
        return jsonify({"message": "Nota adicionada!", "note": {"id": new_note.id, "content": new_note.content, "category": new_note.category, "created_at": new_note.created_at, "updated_at": new_note.updated_at}})
    except Exception as e:
        return jsonify({"error": "Erro ao adicionar nota", "message": str(e)}), 500

@app.route('/delete_note/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    try:
        note = Note.query.get_or_404(note_id)
        db.session.delete(note)
        db.session.commit()
        return jsonify({"message": "Nota removida!"})
    except Exception as e:
        return jsonify({"error": "Erro ao remover nota", "message": str(e)}), 500

@app.route('/move_note/<int:note_id>', methods=['POST'])
def move_note(note_id):
    try:
        data = request.json
        if not data or "category" not in data:
            return jsonify({"error": "Dados inválidos"}), 400
        
        note = Note.query.get_or_404(note_id)
        note.category = data["category"]
        db.session.commit()
        return jsonify({"message": "Nota movida!"})
    except Exception as e:
        return jsonify({"error": "Erro ao mover nota", "message": str(e)}), 500
    



@app.route('/edit_note/<int:note_id>', methods=['PUT'])
def edit_note(note_id):
    try:
        data = request.json
        note = Note.query.get_or_404(note_id)

        if "content" in data:
            note.content = data["content"]
        if "category" in data:
            note.category = data["category"]

        note.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Nota atualizada!", "note": {
            "id": note.id, "content": note.content, "category": note.category,
            "created_at": note.created_at, "updated_at": note.updated_at
        }})
    except Exception as e:
        return jsonify({"error": "Erro ao editar nota", "message": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)  # Modifique a porta para 5001

