import logo from './logo.svg';
import {useEffect, useState} from 'react'
import Modal from 'react-modal';
import axios from 'axios'

function App() {

  const [modalIsOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState([])
  const [todoId, setTodoId] = useState('')
  const [todo, setTodo] = useState('')
  const [category, setCategory] = useState('')
  const [change, setChange] = useState(false)
  const [onEdit, setOnEdit] = useState(false)
  const customStyles = {
    overlay :{
      backgroundColor: 'rgba(4, 4, 4, 0.7)',
      zIndex: 1000,
    },
    borderRadius:'10px',
    paddingTop: '5px',
    content: {
      width: '300px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  function openModal() {
    setIsOpen(true);
    setTodo('')
    setCategory('')
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getTodos = async () => {
    const config = {
      Headers: {
        "Content-type": "aplication/json"
      }
    }
    try {
      let response = await axios.get(`http://localhost:5000/api/v1/todos`,config)
      setTodos(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const config = {
      Headers: {
        "Content-type": "aplication/json"
      }
    }

    if(onEdit === true){
      try {
        await axios.patch(`http://localhost:5000/api/v1/todo/${todoId}`, {todo, category}, config)
        closeModal()
        setChange(!change)
        setOnEdit(false)
      } catch (error) {
        console.log(error)
      }
    }else {
      try {
        let response = await axios.post('http://localhost:5000/api/v1/todo', {todo, category}, config)
        console.log(response)
        setTodos(response.data.data)
        setTodo('')
        setChange(!change)
        closeModal()
      } catch (error) {
        console.log(error)
      }
    }
  }
  const editTodo = async (id) => {
    openModal()
    setTodoId(id)
    setOnEdit(true)
    const config = {
      Headers: {
        "Content-type": "aplication/json"
      }
    }
    try {
      let response = await axios.get(`http://localhost:5000/api/v1/todo/${id}`,config)
      setTodo(response.data.data.todo)
      setCategory(response.data.data.category)

    } catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = async (id) => {
    const config = {
      Headers: {
        "Content-type": "aplication/json"
      }
    }
    try {
      await axios.delete(`http://localhost:5000/api/v1/todo/${id}`,config)
      setChange(!change)

    }catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getTodos()
  },[change])

  return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <button className="btn btn-primary mt-5" onClick={openModal}>Add Todo</button>
            <table className="table">
              <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Todo</th>
                <th scope="col">Category</th>
                <th scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              {todos.length > 0 ?
                  todos.map((data, index) => (
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>{data.todo}</td>
                        <td>{data.category}</td>
                        <td>
                          <button
                              className="btn btn-warning"
                              onClick={() => editTodo(data.id)}
                          >Edit</button>
                          <button
                              className="btn btn-danger"
                              onClick={() => deleteTodo(data.id)}
                          >Delete</button>
                        </td>
                      </tr>
                  ))

                  : <tr>Todo is Empty</tr>}

              </tbody>
            </table>
          </div>
        </div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
        >
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="mb-3">
              <label className="form-label">Todo</label>
              <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setTodo(e.target.value)}
                  value={todo}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                  className="form-select"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
              >
                <option selected>Category</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </Modal>
      </div>
  );
}

export default App;
