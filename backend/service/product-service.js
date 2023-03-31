const jsonfile = require('jsonfile');
const path = require('path');
// const filePath = ('../database/data.json');

class ProductService {
  static async get(id) {
    try {
      const products = (await jsonfile.readFile(filePath)) || [];
      const product = products.find((p) => p.id === id);
      return product || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getAll(filePath) {
    try {
      const products = (await jsonfile.readFile(filePath)) || [];
      return products;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = ProductService;
