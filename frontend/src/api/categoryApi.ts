import { apiFetch } from './client'
import type { Category } from '../types/category'

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories')
}