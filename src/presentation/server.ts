import express, {Router} from 'express'
import path from 'path'

interface Options {
  port: number;
  routes: Router;
  public_path: string;
}

export class Server {
  private app = express()
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const {port, public_path, routes} = options
    this.port = port
    this.publicPath = public_path
    this.routes = routes
  }

  async start() {
    // * MIDDLEWARES
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))

    // * PUBLIC FOLDER
    this.app.use(express.static(this.publicPath))

    // * ROUTES
    this.app.use(this.routes)

    // * SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`)
      res.sendFile(indexPath)
    })

    this.app.listen(3000, () => {
      console.log(`Server running on port ${this.port}`)
    })
  }
}