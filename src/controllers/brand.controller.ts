import { Request, Response } from "express";
import { BrandService } from "../services/brand.service";

const brandService = new BrandService();

export const createBrand = async (req: Request, res: Response) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json({ success: true, data: brand });
};

export const getBrands = async (_req: Request, res: Response) => {
  const brands = await brandService.getBrands();
  res.status(200).json({ success: true, data: brands });
};

export const getBrandById = async (req: Request, res: Response) => {
  const brand = await brandService.getBrandById(req.params.id!);
  res.status(200).json({ success: true, data: brand });
};

export const updateBrand = async (req: Request, res: Response) => {
  const updated = await brandService.updateBrand(req.params.id!, req.body);
  res.status(200).json({ success: true, data: updated });
};

export const deleteBrand = async (req: Request, res: Response) => {
  const deleted = await brandService.deleteBrand(req.params.id!);
  res
    .status(200)
    .json({ success: true, message: "Brand deleted", data: deleted });
};
