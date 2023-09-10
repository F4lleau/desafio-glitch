import { Router } from "express";
import ProductManager from "../productmanager.js";

const path = './src/productos.json'
const prodsRouter = Router()

const prodManager = new ProductManager(path)

prodsRouter.get('/', async (req, res) =>{
    const {limit}= req.query
    const prods = await prodManager.getProducts()
    const products=prods.slice(0, limit)
    res.status(200).json(products)
})

prodsRouter.get('/:id', async(req, res) =>{
    const {id}= req.params
    const prod = await prodManager.getProductById(parseInt(id))
    if (prod) {
        res.status(200).send(prod)
    }else{
        res.status(404).send("producto no encontrado ")
    }
})

prodsRouter.post('/', async(req, res) =>{
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

prodsRouter.put('/:id', async(req, res) =>{
    const {id} =req.params
    const confirmacion= await prodManager.getProductById(parseInt(req.params.id))
    if(confirmacion){
        if (!req.body.title||!req.body.description||!req.body.price||!req.body.code||!req.body.stock||!req.body.category){
            return res.status(400).send({status:"error",error:"Valores incompletos"})
        }else{
            await prodManager.updateProduct(parseInt(id), req.body) 
            res.status(200).send("Producto actualizado") 
        }              
    }else{
        res.status(404).send("Producto no encontrado")        
    }
})

prodsRouter.delete('/:id', async(req, res) =>{
    const {id} =req.params
    const confirmacion= await prodManager.getProductById(parseInt(req.params.id))
    if(confirmacion){
        await prodManager.deleteProduct(parseInt(id))
        res.status(200).send("Producto eliminado")        
    }else{
        res.status(404).send("Producto no encontrado")        
    }
})


export default prodsRouter