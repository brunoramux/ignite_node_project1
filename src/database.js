import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url) //caminho do arquivo de banco de dados

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8') //tenta ler o arquivo
      .then(data => {
        this.#database = JSON.parse(data) //joga dados do arquivo dentro da variavel #database
      })
      .catch(() => {
        this.#persist() //caso o arquivo nao exista, chama o metodo #persist que cria o arquivo
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database)) //escreve o arquivo com dados da variavel #database
  }

  select(table, search) {
    let data = this.#database[table] ?? [] //procura tabela informada

    if (search) { //se existir parametro na procura
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase()) //retorna apenas dados da linha especifica
        })
      })
    }

    return data //retorna todos os dados caso nao foi informado o search
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id) //acha o index especifico do ID informado

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}
