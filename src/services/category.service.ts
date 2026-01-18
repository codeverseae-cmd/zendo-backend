import { Category } from "../models/category.model";

export class CategoryService {
  async create(data: any) {
    return await Category.create(data);
  }

  async getAllCategories() {
    return await Category.find();
  }

  async getCategoryById(id: string) {
    return await Category.findById(id);
  }

  async updateCategory(id: string, data: any) {
    return await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteCategory(id: string) {
    return await Category.findByIdAndDelete(id);
  }
}
