import { Request, Response } from "express"

interface Todos {
  id: number;
  text: string;
  completedAt: Date | null
}
const todos: Array<Todos> = [
  { id:1, text: 'Buy milk', completedAt: new Date()},
  { id:2, text: 'Buy coke', completedAt: new Date()},
  { id:3, text: 'Buy tea', completedAt: new Date()}
]

export class TodosController {
  // * DI
  constructor() {}

  public getTodos = (req:Request, res:Response) => {
    return res.json(todos)
  }

  public getTodoById = (req:Request, res:Response) => {
    const id = +req.params.id
    if(isNaN(id)) return res.status(400).json({error: `ID argument is not a number.`})
    const todo = todos.find(todo => todo.id === id);
    (todo)
    ? res.status(200).json(todo)
    : res.status(404).json({error: `Todo with ID ${id} not found.`})
  }

  public createTodo = (req:Request, res:Response) => {
    const { text } = req.body
    if(!text) return res.status(400).json({error: 'Text property is required'})
    
    const newTodo = ({
      id: todos.length + 1, // Esto NUNCA se debe hacer, aquí es solo para probar
      text,
      completedAt: new Date()
    })

    todos.push(newTodo)

    res.json(newTodo)
  }

  public updateTodo = (req:Request, res:Response) => {
    const id = parseInt(req.params.id)
    if(isNaN(id)) return res.status(400).json({error: `ID argument is not a number.`})

    const todo = todos.find(todo => todo.id === id);
    if(!todo) return res.status(400).json({error: `Todo with id ${id} not found`})

    const {text, completedAt} = req.body
    
    todo.text = text || todo.text; // ESTO NO SE DEBE HACER
    (completedAt === 'null')
    ? todo.completedAt = null
    :todo.completedAt = new Date(completedAt || todo.completedAt)

    res.json(todo)

  }

  public deleteTodo = (req:Request, res:Response) => {
    const id = +req.params.id
    if(isNaN(id)) return res.status(400).json({error: `ID argument is not a number.`});
    const todo = todos.find(todo => todo.id === id);
    if(!todo) return res.status(400).json({error: `Todo with id ${id} not found`});
    /**
     * Manera de FH:
     * 
     * todos.splice(todos.indexOf(todo), 1)
     * res.json(todos)
     * 
     * El todo es una referencia al todos, por ello
     * mantiene el índice original
     */
    const newTodos = todos.filter(save => save != todo)
    todos.splice(0)
    newTodos.map(el => todos.push(el))
    res.json(todos)
  }
}