interface RequestSocket<T> {
  count?: number
  ptCommand?: number
  ptGroup?: number
  result?: string
  params: T
}

export default RequestSocket
