import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  //PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_TYPE_CARD'
}

function BoardContent({ board }) {

  // poiterSensor: dùng chung nhưng còn bug => chia ra 2 kiểu(mouse & touch)
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } }) // // Press delay of 250ms, with tolerance of 5px of movement

  // Di chuyển chuột 10px thì mới kích hoạt event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn và giữ 250ms & di chuyển 5px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  //const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng 1 thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState([null])
  const [activeDragItemType, setActiveDragItemType] = useState([null])
  const [activeDragItemData, setActiveDragItemData] = useState([null])
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([null])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu kéo card thì mới thực hiện hành động set giá trị oldColum
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Đang trong quá trình kéo
  const handleDragOver = (event) => {
    // Không làm gì thêm khi đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các colum
    // console.log('handleDragOver: ', event)
    const { active, over } = event

    // Nếu không tồn tại active hoặc over thì không làm gì
    if (!active || !over) return

    // activeDraggingCardId: card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId: card đang được tương tác trên hoặc dưới so với card được kéo ở trên
    const { id: overCardId } = over

    // Tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || ! overColumn) return

    // Xử lý lúc kéo
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // Tìm vị trí của overCard trong column đích(nơi mà activeCard sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Logic tính toán 'cardIndex mới'
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OrderedColumnState cũ ra 1 cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        // Column cũ
        if (nextActiveColumn) {
          // Xóa card ở cái column active(column cũ)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        // Column mới
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // Tiếp theo là kéo nó vào overColumn theo vị trí mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        // console.log('nextColumns: ', nextColumns)

        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Kiểm tra nếu ko tồn tại active hoặc over (Kéo linh tinh ra ngoài) thì return để tránh lỗi
    if (!active || !over) return

    // Xử lí kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId: card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId: card đang được tương tác trên hoặc dưới so với card được kéo ở trên
      const { id: overCardId } = over

      // Tìm 2 cái column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || ! overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        //
      } else { // Hành động kéo thả card vào cùng 1 column
        // Get old index from oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard.cards?.findIndex(c => c._id === activeDragItemId)
        // Get new index from overColumn
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        const dndOrderedCard = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          // Clone mảng OrderedColumnState cũ ra 1 cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState
          const nextColumns = cloneDeep(prevColumns)

          // Tìm tới column đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCard
          targetColumn.cardOrderIds = dndOrderedCard.map(card => card._id)

          // return giá trị state mới
          return nextColumns
        })
      }
    }

    // Xử lí kéo thả column trong 1 cái BoardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kéo thả != vị trí ban đầu
      if (active.id !== over.id) {
        // Get old index from active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Get new index from over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Code of arrayMove function link: https://github.com/clauderic/dnd-kit/blob/master/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // 2 console.log for handle call API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns: ', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Những dữ liệu sau khi kéo thả phải đưa về null giá trị ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // console.log('activeDragItemId: ', activeDragItemId)
  // console.log('activeDragItemTyoe: ', activeDragItemType)
  // console.log('activeDragItemData: ', activeDragItemData)

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
