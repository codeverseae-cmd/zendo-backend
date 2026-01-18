import { Product } from "../models/product.model";
import { ProductType } from "../types/product.type";
import { AppError } from "../utils/AppError";

export class ProductService {
  async createProduct(productData: any) {
    const product = await Product.create(productData);
    return product;
  }

  async getProducts(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      brandId,
      priceMin,
      priceMax,
    } = query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    //  Filters
    const filter: any = {};

    if (search) {
      filter.$or = [
        { "name.en": { $regex: search, $options: "i" } },
        { "name.ar": { $regex: search, $options: "i" } },
      ];
    }
    if (brandId) filter.brandId = brandId;
    if (categoryId) filter.categoryId = categoryId;

    // Price filters
    if (query.priceMin || query.priceMax) {
      filter.price = {};
      if (query.priceMin) filter.price.$gte = Number(query.priceMin);
      if (query.priceMax) filter.price.$lte = Number(query.priceMax);
    }

    // Count total items
    const total = await Product.countDocuments(filter);

    //  Fetch Data with pagination
    const products = await Product.find(filter)
      .populate("categoryId")
      .populate("brandId")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    return {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    };
  }

  async getProductById(id: string) {
    const product = await Product.findById(id)
      .populate("categoryId")
      .populate("brandId");
    if (!product) {
      throw new AppError({
        message: `product with ID ${id} not found`,
        statusCode: 404,
        code: "PRODUCT_NOT_FOUND",
      });
    }
    return product;
  }

  async editProductById(id: string, updateDAta: ProductType) {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateDAta, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      throw new AppError({
        message: `Product with ID ${id} not found`,
        statusCode: 404,
        code: "PRODUCT_NOT_FOUND",
      });
    }
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      throw new AppError({
        message: `Product with ID ${id} not found`,
        statusCode: 404,
        code: "PRODUCT_NOT_FOUND",
      });
    }

    return deletedProduct;
  }
}
