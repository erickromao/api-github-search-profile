import { GithubUser } from "./GithubUser.js"

export class Favoritos {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {

        this.entries = JSON.parse(localStorage.getItem('@github-favoritos:')) || []
    }

    save(){
        localStorage.setItem('@github-favoritos:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry=> entry.login === username)

            if(userExists){
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            if(user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error){
            alert(error.message)
        }
        
    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritosView extends Favoritos {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositorios').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <tr>
            <td class="user"    >
                <img src="https://github.com/guilhermediniz1.png">
                <a href="https://github.com/guilhermediniz1" target="_blank">
                    <p>Guilherme Diniz</p>
                    <span>guilhermediniz1</span>
                </a>
            </td>
            <td class="repositorios">27</td>
            <td class="followers">15</td>
            <td>
                <button class="remove">&times;</button>
            </td>
        </tr>
    `
        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach(tr => tr.remove())
    }

}
