// Capitalize the first letter of a string

export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// Hàm tạo ra một Placeholder Card rỗng để xử lý trường hợp Column rỗng
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholer-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}