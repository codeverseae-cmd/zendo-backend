import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

export const createCategory = async (req: Request, res: Response) => {
  const category = await categoryService.create(req.body);
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.id!;
  const category = await categoryService.getCategoryById(id);
  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
  res.status(200).json({
    success: true,
    data: category,
  });
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id!;
  const updateCategory = await categoryService.updateCategory(id, req.body);
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updateCategory,
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const deleteCategory = await categoryService.deleteCategory(req.params.id!);
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: deleteCategory,
  });
};
