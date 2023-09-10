import { Router } from "express";
import CartsManager from "../cartsmanager.js";

const cartsRouter = Router()
const path = './src/carrito.json'

const cartManager = new CartsManager(path)

/*
cartsRouter.post('/', async(req, res) =>{
    const {code}= req.body
    const confirmacion= await prodManager.getProductByCode(code)
    if(confirmacion){
        res.status(400).send("Producto ya creado")        
    }else{
        if (!req.body.title||!req.body.description||!req.body.price||!req.body.code||!req.body.stock||!req.body.category){
            return res.status(400).send({status:"error",error:"Valores incompletos"})
        }else{
            const conf=await prodManager.addProduct(req.body)
            if(conf)
                res.status(200).send("Producto creado")
        }       
    }
})
*/

cartsRouter.post('/', async (req, res) => {
    const confirmacion = await cartManager.createCart()
    if (confirmacion) {
        res.status(200).send("Carrito creado correctamente")
    } else {
        res.status(400).send("Error al crear carrito")
    }
})

cartsRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    const cart = await cartManager.getCartById(id) // {id: "idEjemplo", products:[{id:"idProducto", quantity: 5},...]}

    if (cart)
        res.status(200).send(cart.products)
    else
        res.status(404).send("Carrito no encontrado")

})

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params

    const cart = await cartManager.getCartById(cid) // {id: "idEjemplo", products:[{id:"idProducto", quantity: 5},...]}


    if (cart) {
        const confirmacion = await cartManager.addProduct(cid, pid)
        if (confirmacion)
            res.status(200).send("Producto agregado correctamente")
        else
            res.status(400).send("Error al agregar producto")
    } else {
        res.status(404).send("Carrito no encontrado")
    }


})


export default cartsRouter