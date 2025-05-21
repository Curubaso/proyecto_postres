const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // Importar ObjectId para buscar por id
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const uri = 'mongodb+srv://Curubaso:Santyago2303%2A@cluster0.d3rong1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB Atlas');

    const db = client.db('pusheenCakes');
    const collection = db.collection('pedidos');

    // POST - Crear pedido
    app.post('/api/postres', async (req, res) => {
      try {
        const nuevoPedido = req.body;
        const resultado = await collection.insertOne(nuevoPedido);
        res.status(201).json({ mensaje: 'Pedido agregado', id: resultado.insertedId });
      } catch (error) {
        console.error('Error al agregar pedido:', error);
        res.status(500).json({ mensaje: 'Error al agregar pedido' });
      }
    });

    // GET - Obtener todos los pedidos
    app.get('/api/postres', async (req, res) => {
      try {
        const pedidos = await collection.find({}).toArray();
        res.json(pedidos);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).json({ mensaje: 'Error al obtener pedidos' });
      }
    });

    // PUT - Actualizar pedido por id
    app.put('/api/postres/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const datosActualizados = req.body;
        const resultado = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: datosActualizados }
        );
        if (resultado.matchedCount === 0) {
          return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }
        res.json({ mensaje: 'Pedido actualizado' });
      } catch (error) {
        console.error('Error al actualizar pedido:', error);
        res.status(500).json({ mensaje: 'Error al actualizar pedido' });
      }
    });

    // DELETE - Eliminar pedido por id
    app.delete('/api/postres/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const resultado = await collection.deleteOne({ _id: new ObjectId(id) });
        if (resultado.deletedCount === 0) {
          return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }
        res.json({ mensaje: 'Pedido eliminado' });
      } catch (error) {
        console.error('Error al eliminar pedido:', error);
        res.status(500).json({ mensaje: 'Error al eliminar pedido' });
      }
    });

    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
  }
}

main().catch(console.error);
