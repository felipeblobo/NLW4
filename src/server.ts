 import express from "express";
 
 const app = express();
 const port = 3333;

 app.get('/', (request, response) => {
     return response.json({'message': 'oi'})
 });

 app.post('/', (request, response) => {
     return response.json({'message':'dados salvos'})
 });

 app.listen(port, () => {
     console.log(`Servidor rodando na porta ${port}!`)
 })