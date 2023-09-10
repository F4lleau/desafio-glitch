import { promises as fs } from 'fs'

class ProductManager {
    constructor(path) {
        this.ruta = path;
    }

    async getProducts() {
        const prods = JSON.parse(await fs.readFile(this.ruta, 'utf-8'))
        return prods      
    }

    async getProductById(id) {
        const prods = JSON.parse(await fs.readFile(this.ruta, 'utf-8'))
        return prods.find((producto) => producto.id === id);
    }

    async getProductByCode(code) {
        const prods = JSON.parse(await fs.readFile(this.ruta, 'utf-8'))
        return prods.find((producto) => producto.code === code);
    }

    async addProduct(body) {
        const prods = JSON.parse(await fs.readFile(this.ruta, 'utf-8'))
        if (prods.length > 0){
            var id = prods.slice(-1)[0].id + 1
        }else{
            var id = 1
        }
        prods.push({"id":id,"title":body.title,"description":body.description,"code":body.code,"price":body.price,"status":true,"stock":body.stock,"category":body.category,"thumbnail":body.thumbnail})
        await fs.writeFile(this.ruta, JSON.stringify(prods));
        return 1
    }

    async updateProduct(id, body){
        const prods = JSON.parse(await fs.readFile(this.ruta, 'utf-8'))
        const productIndex = prods.findIndex(prod => prod.id === parseInt(id))
        prods[productIndex].title = body.title
        prods[productIndex].description = body.description
        prods[productIndex].code = body.code
        prods[productIndex].price = body.price
        prods[productIndex].stock = body.stock
        prods[productIndex].category = body.category
        prods[productIndex].thumbnail = body.thumbnail
        await fs.writeFile(this.ruta, JSON.stringify(prods));
    } 

    async deleteProduct(id) {
        var prods = JSON.parse(await fs.readFile(this.ruta, 'utf-8'))
        prods = prods.filter(prod => prod.id != parseInt(id))
        await fs.writeFile(this.ruta, JSON.stringify(prods));
    }

}



export default ProductManager