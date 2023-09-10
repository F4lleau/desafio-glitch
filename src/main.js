import express from 'express';
import multer from 'multer';
import prodsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import {__dirname} from './path.js';
import {engine} from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';

const PORT = 8080

const app= express()

//config

const storage = multer.diskStorage({
    destination:(req, file,cb)=>{
        cb(null, 'src/public/img') //destino de las imagenes que suba
    },
    filename: (req, file, cb)=>{  //forma de guardarlos
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//Middelware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = multer ({storage:storage})

app.engine('handlebars', engine()) //defino motor de plantilla a usar y su config
app.set('view engine','handlebars') //setting de app de handleb
app.set('views', path.resolve(__dirname, './views')) // ruta d las vistas
app.use('/static', express.static(path.join(__dirname, '/public'))) //ruta publica


//server socket.io
const io = new Server(serverExpress)
const mensajes = []
const prods = []
io.on('connection', (socket) => {
    console.log("Servidor Socket.io conectado")
    socket.on('mensajeConexion', (user) => {
        if (user.rol === "Admin") {
            socket.emit('credencialesConexion', "Usuario valido")
        } else {
            socket.emit('credencialesConexion', "Usuario no valido")
        }
    })


    //para recibir los mensajes
    socket.on('mensaje', (infoMensaje) => {
        console.log(infoMensaje)
        mensajes.push(infoMensaje)
        socket.emit('mensajes', mensajes)
    })

    socket.on('nuevoProducto', (nuevoProd) => {
        prods.push(nuevoProd)
        socket.emit('prods', prods)
    })
})

//Routes

app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)
app.get('/static', (req, res)=>{
    res.render('Chat', {
        css: "style.css",
        title: "Chat",
        js: "realTimeProducts.js"

    })
})

app.post('/upload', upload.single('product'), (req, res)=>{
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")

})


console.log(__dirname)


