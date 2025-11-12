from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///filme.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
class Filme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    diretor = db.Column(db.String(100), nullable=False)
    ano_lancamento = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'diretor': self.diretor,
            'ano_lancamento': self.ano_lancamento
        }


@app.route('/filmes', methods=['GET'])
def get_filmes():
    filmes = Filme.query.all()
    return {'filmes': [filme.to_dict() for filme in filmes]}, 200