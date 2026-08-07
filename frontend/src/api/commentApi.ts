import { apiFetch } from './client'
import type {
  Comment,
  CreateCommentRequest,
} from '../types/comment'

export function getComments(
  ticketId: number
): Promise<Comment[]> {
  return apiFetch<Comment[]>(
    `/tickets/${ticketId}/comments`
  )
}

export function createComment(
  ticketId: number,
  request: CreateCommentRequest
): Promise<Comment> {
  return apiFetch<Comment>(
    `/tickets/${ticketId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
}