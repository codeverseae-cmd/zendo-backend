export type ProductType = {
  id: number
  name: string
  mainCategory: string
  subCategory: string
  brand: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  discount?: string
  discountColor: string
  badge?: string
  badgeColor?: string
}