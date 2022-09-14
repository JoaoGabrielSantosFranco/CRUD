const modal = document.querySelector('.modal-container')
const btnSalvar = document.querySelector('#btnSalvar')

function openModal() {
    modal.classList.add('active')

    modal.onclick = e => { //se clicar fora da tela é o modal é fechado 
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active')
        }
    }
}

const closeModal = () => {
    clearFields()
    modal.classList.remove('active')
}


//--------------------CRUD CREATE--------------
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] //se não existe uma lista crie uma e se existe adiciona o cliente nela
const setLocalStorage = (dbclient) => localStorage.setItem("db_client", JSON.stringify(dbclient))

const createClient = (client) => {
    const dbclient = getLocalStorage()
    dbclient.push(client)
    setLocalStorage(dbclient)
}

//Interação com o Layout

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}
//--------------------CRUD CREATE FIM--------------


//--------------------CRUD READ--------------
const readClient = () => getLocalStorage()



//--------------------CRUD READ FIM--------------

//--------------------CRUD UPDATE--------------

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
const icone = '<iconificar-icon="bx:trash"></iconify-iconify>'

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td class="acao">
        <button type="button" <i class='bx bx-edit' id='edit-${index}'-t></button>
        </td>
        <td class="acao">
        <button type="button" <i class='bx bx-trash' id='delete-${index}'></button>
         </td>
         `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}


//--------------------CRUD DELETE--------------

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}


const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('nome').dataset.index = client.index
}


const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()


// EVENTS
document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('btnSalvar').addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)