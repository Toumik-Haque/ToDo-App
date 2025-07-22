// Mini Project - CRUD on ToDo App via API

import { useEffect, useState } from "react"
// import todo from './assets/todo.png'

function Todo() {

    const [title, setTitle] = useState("")
    const [todoList, setTodoList] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [modalId, setModalId] = useState('')
    const [modalTitle, setModalTitle] = useState('')


    function getInput(event) {

        setTitle(event.target.value)
    }

    async function handleAddTodo(e) {
        e.preventDefault()

        if (title.trim() === '') return;

        const res = await fetch('http://localhost:5000/api/todo/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        })

        if (res.ok) {
            console.log('Todo Added Successfully')
            setTitle('')
            fetchTodos()
        }
    }

    async function fetchTodos() {
        const res = await fetch('http://localhost:5000/api/todo/all')
        const data = await res.json()
        setTodoList(data)
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    async function deleteTodo(id) {

        const res = await fetch(`http://localhost:5000/api/todo/${id}`, {
            method: 'DELETE'
        })
        if (res.ok) {
            console.log(id, 'Deleted Successfully')
            fetchTodos()
        }
    }

    function editTodo(id, title) {

        setEditModal(true)
        setModalId(id)
        setModalTitle(title)
    }
    async function saveEdit(id) { // get modalId via id

        if (modalTitle.trim() === '') return;

        const res = await fetch(`http://localhost:5000/api/todo/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: modalTitle })
        })
        if (res.ok) {
            console.log(id, 'Updated Successfully')
            fetchTodos()
            setEditModal(false)
        }
    }


    async function clearAll() {
        console.log('try to clear...')
        const res = await fetch('http://localhost:5000/api/todo', {
            method: 'DELETE'
        })
        if (res.ok) {
            console.log('Cleared All Todo Successfully')
            fetchTodos()
        }
    }

    async function handleCheck(id, complete) {

        const res = await fetch(`http://localhost:5000/api/todo/status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !complete })
        })
        if (res.ok) {
            console.log(id, ((!complete ? 'ToDo Completed' : 'ToDo Uncompleted')))
            fetchTodos()
        }
    }

    return (

        <div className="d-flex flex-column align-items-center mt-5">

            
            <h1>
                <img src="/todo.png" alt="" style={{ width: '40px', height: '40px'}} className="me-3 mb-2"/>
                ToDo App</h1>
            <form onSubmit={handleAddTodo} className="mt-4 d-flex mb-5">
                <input type="text" placeholder="What you plan to do" className="p-0 px-2 rounded" onChange={(event) => getInput(event)} value={title} required />
                <button type="submit" className="btn btn-primary ms-2">Add</button>
            </form>
            {
                todoList.length >= 2 && (
                    <div className="clear-btn">
                        <button className="btn btn-outline-danger mb-2 align-self-start ms-20vw fw-bold" onClick={clearAll}>Clear All ToDos</button>
                    </div>
                )

            }

            {
                todoList.map((ele) => (

                    <div className="eachtodo d-flex align-self-center py-2" key={ele._id}>

                        <div className="d-flex">
                            <input type="checkbox" checked={ele.completed} onChange={() => handleCheck(ele._id, ele.completed)}/>
                            <p className="ms-3 m-0">{ele.title}</p>
                        </div>
                        {
                            ele.completed ? (
                                <div className="after-title completed fw-bold me-4 fst-italic ">
                                    Completed
                                </div>
                            ) : (
                                <div className="after-title d-flex ms-3">
                                    <button className="btn btn-warning me-2" onClick={() => editTodo(ele._id, ele.title)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => deleteTodo(ele._id)}>Delete</button>
                                </div>
                            )
                        }

                    </div>

                ))
            }

            {
                editModal ? (

                    <div className="modal d-block modal-bg" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setEditModal(false)}></button>
                                </div>
                                <div className="modal-body d-flex flex-column gap-3 align-items-center">
                                    <h4>Edit Your Todo</h4>
                                    <div className="d-flex flex-column justify-content-center gap-3 mb-3">
                                        <input type="text" className="p-2 text-primary rounded" value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} />
                                        <button type="button" className="btn btn-warning align-self-center" onClick={() => saveEdit(modalId)}>Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : null
            }

        </div>
    )
}

export default Todo