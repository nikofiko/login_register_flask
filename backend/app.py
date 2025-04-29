from flask import Flask, jsonify, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app) 

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users')
    users = c.fetchall()
    conn.close() 
    users_list = [{'id': user['id'], 'username': user['username'], 'hash': user['hash']} for user in users]
    return jsonify(users_list)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE username = ?', (username,))
    existing_user = c.fetchone()

    if existing_user:
        conn.close()
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    c.execute('INSERT INTO users (username, hash) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    conn.close()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = c.fetchone()
    conn.close()

    if not user:
        return jsonify({'error': 'Invalid username or password'}), 401

    if not bcrypt.check_password_hash(user['hash'], password):
        return jsonify({'error': 'Invalid username or password'}), 401

    return jsonify({'message': f'Welcome, {username}!'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)