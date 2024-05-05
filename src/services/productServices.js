import Connection from '../db/configMysql.js';
const connection = await Connection();

import ProductModel from '../models/productModel.js';
import getSlug from 'speakingurl';
import crypto from 'crypto';



let ProductServices = {
  createSlug: async (name) => {
    const slug = getSlug(name, { lang: 'vn' });

    let fullSlug, existingCategory;
    do {
      const randomInt = crypto.randomBytes(4).readUInt32LE();
      fullSlug = `${slug}.prod-${randomInt}`;
      existingCategory = await ProductModel.findProductBySlug(connection, fullSlug);

    } while (!existingCategory);
    return fullSlug;
  },

  //addProduct 
  addProduct: async (data) => {

    data.slug = await ProductServices.createSlug(data.name);
    const result = await ProductModel.addProduct(connection, data);



//     // Thêm sản phẩm mới với nhiều phân loại
// function addProduct(productData, classifyDataArray) {
//   return new Promise((resolve, reject) => {
//     connection.beginTransaction((err) => {
//       if (err) {
//         reject(err);
//         return;
//       }

//       // Thêm dữ liệu vào bảng product
//       connection.query('INSERT INTO product SET ?', productData, (err, result) => {
//         if (err) {
//           connection.rollback(() => {
//             reject(err);
//           });
//           return;
//         }

//         const productId = result.insertId;

//         // Thêm dữ liệu vào bảng classify cho mỗi phân loại
//         const insertClassifyPromises = classifyDataArray.map((classifyData) => {
//           classifyData.product_id = productId;
//           return new Promise((resolve, reject) => {
//             connection.query('INSERT INTO classify SET ?', classifyData, (err) => {
//               if (err) {
//                 reject(err);
//                 return;
//               }
//               resolve();
//             });
//           });
//         });

//         // Thực hiện tất cả các truy vấn thêm phân loại và commit giao dịch
//         Promise.all(insertClassifyPromises)
//           .then(() => {
//             connection.commit((err) => {
//               if (err) {
//                 connection.rollback(() => {
//                   reject(err);
//                 });
//                 return;
//               }
//               resolve(`Product added successfully with ID ${productId}`);
//             });
//           })
//           .catch((err) => {
//             connection.rollback(() => {
//               reject(err);
//             });
//           });
//       });
//     });
//   });
// }

// // Sử dụng hàm addProduct
// const productData = {
//   user_id: 1,
//   status_id: 1,
//   name: 'Product Name',
//   price: 100,
//   url_Demo: 'https://example.com/demo',
//   popular: true,
//   // Thêm dữ liệu khác của sản phẩm ở đây
// };

// const classifyDataArray = [
//   {
//     name: 'Classification 1',
//     image: 'https://example.com/image1',
//     urldownload: 'https://example.com/download1',
//     // Thêm dữ liệu khác của classification ở đây
//   },
//   {
//     name: 'Classification 2',
//     image: 'https://example.com/image2',
//     urldownload: 'https://example.com/download2',
//     // Thêm dữ liệu khác của classification ở đây
//   }
// ];

// addProduct(productData, classifyDataArray)
//   .then((message) => console.log(message))
//   .catch((error) => console.error(error));

    return result;
  },


  updateProduct: async (data) => {
    
    data.slug = await ProductServices.createSlug(data.name);

    const result = await ProductModel.updateProduct(connection, data);
    return result;
  },
  deleteProduct: async (id) => {
    const result = await ProductModel.deleteProduct(connection, id);
    return result;
  },
  getProductByCategory: async (data) => {
    const { category, limit, page } = data


    const result = await ProductModel.getProductByCategory(connection, category, page, limit);
    return result;
  },
  getProductBySlug: async (slug) => {
      
    const result = await ProductModel.getProductBySlug(connection, slug);
    return result;
  },

  // --------------------------------------------product Popular--------------------------------------------

  updateProductPopular: async (data) => {
    const result = await ProductModel.updateProductPopular(connection, data);
    return result;
  },
  getProductPopularByCategory: async (data) => {
    const { category, limit, page, popular} = data
  
    const result = await ProductModel.getProductPopularByCategory(connection, category, limit, page, popular);
    return result;
  },

  getList: async (data) => {
      const { pagingParams, filterParams } = data;
      const { orderBy, keyword, pageIndex, pageSize } = pagingParams;
      const {category } = filterParams;

      const page = (parseInt(pageIndex) || 1) - 1;
      const limit = parseInt(pageSize) || 20; // Giới hạn mặc định là 20

      // Tạo câu truy vấn SQL để tính tổng số lượng bản ghi
      let sql = `SELECT COUNT(*) AS total FROM product`;
      ì
      if (user_id && user_id.length > 0) {
          sql += ` WHERE id IN (${user_id.join(',')})`;
      }

      if (keyword) {
          if (user_id && user_id.length > 0) {
              sql += ` AND fullname LIKE '%${keyword}%'`;
          } else {
              sql += ` WHERE fullname LIKE '%${keyword}%'`;
          }
      }
      const [totalRows] = await connection.query(sql);
      const total = totalRows[0].total;

      const totalPages = Math.ceil(total / pageSize);

      // Tạo câu truy vấn SQL để lấy dữ liệu phân trang
      let query = `SELECT * FROM user`;

      if (user_id && user_id.length > 0) {
          query += ` WHERE id IN (${user_id.join(',')})`;
      }

      if (keyword) {
          if (user_id && user_id.length > 0) {
              query += ` AND fullname LIKE '%${keyword}%'`;
          } else {
              query += ` WHERE fullname LIKE '%${keyword}%'`;
          }
      }

      if (orderBy) {
          query += ` ORDER BY ${orderBy}`;
      }

      query += ` LIMIT ${limit} OFFSET ${page * limit}`;

      // Thực hiện truy vấn SQL để lấy dữ liệu phân trang
      const [rows, fields] = await connection.query(query);

      const meta = {
          total: total,
          totalPage: totalPages
      };

      return { data: rows, meta: meta };
  },








}

export default ProductServices;


