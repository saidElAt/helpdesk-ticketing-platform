export interface Comment {
  id: number
  ticketId: number
  authorId: number
  authorName: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateCommentRequest {
  content: string
}