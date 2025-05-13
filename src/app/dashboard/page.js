"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import "../../css/dashboard.css"

const TaskCard = ({ task, index, moveCard, listId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id: task.id, index, listId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div ref={drag} className="task-card" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <span className={`priority ${task.priority}`}>{task.priority}</span>
      </div>
      <p>{task.description}</p>
     <div className="task-card-footer">
      <span className="due-date">Prazo: {task.dueDate}</span>
    </div>
      <div className="task-card-footer">
        <span className="assignee">{task.assignee}</span>
      </div>
    </div>
  )
}

const TaskList = ({ title, tasks, listId, moveCard, onRemoveColumn }) => {
  const [, drop] = useDrop({
    accept: "CARD",
    drop(item, monitor) {
      if (!item) return
      const dragIndex = item.index
      const dragListId = item.listId
      const hoverListId = listId

      if (dragListId === hoverListId) {
        return
      }

      moveCard(item.id, dragListId, hoverListId)
    },
  })

  return (
    <div className="kanban-column" ref={drop}>
      <div className="column-header">
        <h3>{title}</h3>
        <div className="column-header-actions">
          <span className="task-count">{tasks.length}</span>
          {!["todo", "inProgress", "done"].includes(listId) && (
            <button className="remove-column-btn" onClick={() => onRemoveColumn(listId)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} moveCard={moveCard} listId={listId} />
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [columns, setColumns] = useState({
    /*todo: {
      title: "A fazer",
      items: [
        {
          id: 1,
          title: "Relatório mensal",
          description: "Preparar relatório de vendas do mês de abril",
          priority: "alta",
          dueDate: "10/05/2025",
          assignee: "Marta",
        },
        {
          id: 2,
          title: "Reunião com cliente",
          description: "Preparar apresentação para reunião com cliente XYZ",
          priority: "média",
          dueDate: "15/05/2025",
          assignee: "João",
        },
      ],
    },
    inProgress: {
      title: "Em andamento",
      items: [
        {
          id: 3,
          title: "Atualizar site",
          description: "Atualizar conteúdo da página principal do site",
          priority: "baixa",
          dueDate: "08/05/2025",
          assignee: "Ana",
        },
      ],
    },
    done: {
      title: "Concluído",
      items: [
        {
          id: 4,
          title: "Treinamento equipe",
          description: "Realizar treinamento da equipe sobre novo sistema",
          priority: "média",
          dueDate: "01/05/2025",
          assignee: "Carlos",
        },
      ],
    }, */
  })

  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskDueDate, setnewTaskDueDate] = useState("")
  const [showNewColumnModal, setShowNewColumnModal] = useState(false)
  const [newColumnName, setNewColumnName] = useState("")
  
  // Estado para controlar a sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Função para mover um card entre colunas
  const moveCard = (cardId, sourceListId, targetListId) => {
    setColumns((prevColumns) => {
      // Encontrar o card na lista de origem
      const sourceList = prevColumns[sourceListId].items
      const card = sourceList.find((item) => item.id === cardId)

      // Criar novas listas (remover da origem, adicionar ao destino)
      const newSourceList = sourceList.filter((item) => item.id !== cardId)
      const newTargetList = [...prevColumns[targetListId].items, card]

      // Retornar o novo estado
      return {
        ...prevColumns,
        [sourceListId]: {
          ...prevColumns[sourceListId],
          items: newSourceList,
        },
        [targetListId]: {
          ...prevColumns[targetListId],
          items: newTargetList,
        },
      }
    })
  }

  const addNewTask = () => {
    if (!newTaskName.trim()) return
    const taskId = Date.now()
    const newTask = {
      id: taskId,
      title: newTaskName,
      //{description: "Descrição da tarefa",}
      //priority: "média",
      dueDate: newTaskDueDate,
      assignee: "Marta",
    }

    const firstColumnId = Object.keys(columns)[0]
  if (!firstColumnId) return // nenhuma coluna existente

  setColumns((prevColumns) => ({
    ...prevColumns,
    [firstColumnId]: {
      ...prevColumns[firstColumnId],
      items: [...prevColumns[firstColumnId].items, newTask],
    },
  }))
    
    setShowNewTaskModal(false)
    setNewTaskName("")
    setnewTaskDueDate("")
  }

  const addNewColumn = () => {
    if (!newColumnName.trim()) return

    const columnId = `column_${Date.now()}`

    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        title: newColumnName,
        items: [],
      },
    }))

    setNewColumnName("")
    setShowNewColumnModal(false)
  }

  const removeColumn = (columnId) => {
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns }
      delete newColumns[columnId]
      return newColumns
    })
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <>
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Image
            src="https://i.postimg.cc/W1xNjHP7/corpflow.png"
            alt="CorpFlow Logo"
            className="logo"
            width={250}
            height={130}
          />
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            {sidebarCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            )}
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="section">
            <h3>Blocos disponíveis</h3>
            <div className="block-section">
              <button className="concluida">Concluída</button>
            </div>
          </div>

          <div className="section">
            <h3>Tarefas concluídas</h3>
          </div>
        </div>
      </div>

      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="header">
          <div className="dropdown">
            <button className="dropdown-button">
              <span>Welcome, Marta</span>
              <div className="avatar">MA</div>
            </button>

            <div className="dropdown-content">
              <button href="#">
                <Image
                  src="https://img.icons8.com/material-outlined/24/000000/user.png"
                  alt="Profile Icon"
                  width={24}
                  height={24}
                />
                Profile
              </button>
              <button onClick={handleLogout}>
                <Image
                  src="https://img.icons8.com/material-outlined/24/000000/logout-rounded.png"
                  alt="Logout Icon"
                  width={24}
                  height={24}
                />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="task-section">
          <div className="task-header">
            <h2>Minhas tarefas</h2>
            <div className="task-actions">
              <button className="create-task-button" onClick={() => setShowNewTaskModal(true)}>+ Nova tarefa</button>
              <button className="create-column-button" onClick={() => setShowNewColumnModal(true)}>
                + Nova coluna
              </button>
            </div>
          </div>

          <DndProvider backend={HTML5Backend}>
            <div className="kanban-board">
              {Object.keys(columns).map((columnId) => (
                <TaskList
                  key={columnId}
                  title={columns[columnId].title}
                  tasks={columns[columnId].items}
                  listId={columnId}
                  moveCard={moveCard}
                  onRemoveColumn={removeColumn}
                />
              ))}
            </div>
          </DndProvider>
        </div>
      </div>

      {/* Modal para adicionar nova tarefa */}
      {showNewTaskModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Nova Tarefa</h3>
              <button className="close-modal" onClick={() => setShowNewTaskModal(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="taskName">Nome da tarefa</label>
                <input
                  type="text"
                  id="taskName"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Digite o nome da tarefa"
                />
              </div>
              <div className="input-group">
                <label htmlFor="taskDueDate">Prazo</label>
                <input
                  type="date"
                  id="taskDueDate"
                  value={newTaskDueDate}
                  onChange={(e) => setnewTaskDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowNewTaskModal(false)}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={addNewTask}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para adicionar nova coluna */}
      {showNewColumnModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Nova Coluna</h3>
              <button className="close-modal" onClick={() => setShowNewColumnModal(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="columnName">Nome da coluna</label>
                <input
                  type="text"
                  id="columnName"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Digite o nome da coluna"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowNewColumnModal(false)}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={addNewColumn}>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}