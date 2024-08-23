const getSlug = require("slug");
const ProductModel = require("./ProductModel"); // Import model để tìm sản phẩm bằng slug

const createSlug = async (name, type) => {
  const slug = getSlug(name, { lang: "vn" });
  let prefix;
  if (type === "cat") {
    prefix = "cat";
  } else if (type === "pro") {
    prefix = "pro";
  } else {
    throw new Error("Invalid slug type!");
  }

  let fullSlug, existingProduct;
  do {
    const randomInt = crypto.randomBytes(4).readUInt32LE();
    fullSlug = `${slug}.${prefix}-${randomInt}`;
    existingProduct = await ProductModel.getProductByField(
      connection,
      "slug",
      fullSlug
    );
  } while (existingProduct);

  return fullSlug;
};

module.exports = createSlug;
