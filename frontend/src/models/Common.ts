interface RequestSocket<T> {
  count?: number
  ptCommand?: number
  ptGroup?: number
  result?: string
  data: T
}

export default RequestSocket
