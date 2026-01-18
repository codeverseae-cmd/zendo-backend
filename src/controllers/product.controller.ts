import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getProducts = async (req: Request, res: Response) => {
  const result = await productService.getProducts(req.query);
  res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id!;
  const product = await productService.getProductById(id);
  res.status(200).json({
    success: true,
    data: product,
  });
};

export const editProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updateProduct = await productService.editProductById(id!, req.body);
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updateProduct,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await productService.deleteProduct(id!);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
};
