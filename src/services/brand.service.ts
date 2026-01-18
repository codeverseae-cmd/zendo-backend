import { Brand } from "../models/brand.model";
import { AppError } from "../utils/AppError";

export class BrandService {
  async createBrand(data: any) {
    return await Brand.create(data);
  }

  async getBrands() {
    return await Brand.find();
  }

  async getBrandById(id: string) {
    const brand = await Brand.findById(id);
    if (!brand) {
      throw new AppError({ message: "Brand not found", statusCode: 404 });
    }
    return brand;
  }

  async updateBrand(id: string, data: any) {
    const updated = await Brand.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw new AppError({ message: "Brand not found", statusCode: 404 });
    }
    return updated;
  }

  async deleteBrand(id: string) {
    const deleted = await Brand.findByIdAndUpdate(id);
    if (!deleted) {
      throw new AppError({ message: "Brand not found", statusCode: 404 });
    }
    return deleted;
  }
}
