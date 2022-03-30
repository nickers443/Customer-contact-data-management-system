(()=>{
  const mainURL = 'http://localhost:3000/api/clients'
  const header = document.querySelector('.header__container')
  const container = document.querySelector('.main__container')
  const body = document.querySelector('body')
  const DELAY = 300
  const lazyLoad = preloader()
  const sortState = {
    id: true,
    initials: false,
    createdAt: false,
    updatedAt: false
  }

  async function getData() {
    const response = await fetch(mainURL)
    let data =  await response.json()
    return data
  } 

  function createSearchInput(type, placeholder, className) {
    const input = document.createElement('input')
    const form = document.createElement('form')

    form.append(input)
    form.classList.add('header__form')
    input.setAttribute('type', type)
    input.setAttribute('placeholder', placeholder)
    input.classList.add(className)
    
    return {
      form,
      input
    }
  }

  function createTitle(text, className) {
    const h2 = document.createElement('h2')
    h2.classList.add(className)
    h2.textContent = text

    return h2
  }

  function getFormatDate(str) {
    return `${str.slice(8, 10)}.${str.slice(5, 7)}.${str.slice(0, 4)}`
  }

  function getFormatTime(str) {
    return str.slice(11, 16)
  }

  function getFormatId(str) {
    return str.slice(-6)
  }

  function createActionButton(type, text, user) {
    const button = document.createElement('button') 
    const img = document.createElement('span') 
    const nameButton = document.createElement('span') 

    button.classList.add('action__button')
    img.classList.add(`${type}__button-svg`)
    nameButton.textContent = text

    if(type === 'edit') {
      button.classList.add('action__button-change')
    }

    if(type === 'delete') {
      button.classList.add('action__button-del')
    }

    button.append(img)
    button.append(nameButton)

    button.addEventListener('click', () => {
      if(type === 'edit') {
        loadButtonAnimation(img, button, type)
        setTimeout(() => {
          createModal('changeUser', user)
          deleteLoadButtonAnimation(img, button, type)
        }, 300)
      } 
      if(type === 'delete') {
        loadButtonAnimation(img, button, type)
        setTimeout(() => {
          createModal('deleteUser', user)
          deleteLoadButtonAnimation(img, button, type)
        }, 300)
      }
    })


    return button
  }

  function loadButtonAnimation(img, button, type) {
    img.classList.remove(`${type}__button-svg`)
    img.classList.add(`action__button-${type}-rotate`)
    button.classList.add(`action__button-${type}-active`)
  }

  function deleteLoadButtonAnimation(img, button, type) {
    img.classList.add(`${type}__button-svg`)
    img.classList.remove(`action__button-${type}-rotate`)
    button.classList.remove(`action__button-${type}-active`)
  }

  function createContactAndTooltips(contacts) {
    const tdUserContactsContainer = document.createElement('div')
    tdUserContactsContainer.classList.add('user__contacts-grid')
    const itemNum = document.createElement('div')
    const maxItem = 4

    contacts.forEach((contact, index)=> {
      const item = document.createElement('div')
      const tooltipText = document.createElement('span')
      tooltipText.classList.add('contacts__item-tooltip')

      if(contact.type === 'Телефон') {
        item.classList.add('contacts__item-tel')
        tooltipText.innerHTML = `${contact.type}: <a href='tel:${contact.value}'> ${contact.value}</a>`
      }
      if(contact.type === 'Email') {
        item.classList.add('contacts__item-email')
        tooltipText.innerHTML = `${contact.type}: <a href='mailto:${contact.value}'> ${contact.value}</a>`
      }
      if(contact.type === 'Facebook') {
        item.classList.add('contacts__item-fb')
        tooltipText.innerHTML = `${contact.type}: <a href='${contact.value}' target="_blank" class='contacts__item-tooltip-format'>${contact.value}</a>`
      }
      if(contact.type === 'VK') {
        item.classList.add('contacts__item-vk')
        tooltipText.innerHTML = `${contact.type}: <a href='${contact.value}' target="_blank" class='contacts__item-tooltip-format'>${contact.value}</a>`
      }
      if(contact.type === 'Другое') {
        item.classList.add('contacts__item-other')
        tooltipText.innerHTML = `${contact.type}: <a href='${contact.value}' target="_blank" class='contacts__item-tooltip-format'>${contact.value}</a>`
      }
      if(index >= 4) {
        const otherTooltip = document.createElement('span')
        otherTooltip.textContent = 'Показать все контакты'
        otherTooltip.classList.add('contacts__item-tooltip')
        item.classList.add('display-none')
        itemNum.classList.add('contacts__item-sum')
        itemNum.textContent = `+${contacts.length - maxItem}`
        itemNum.append(otherTooltip)
      }

      item.classList.add('contacts__item')
      item.append(tooltipText)
      tdUserContactsContainer.append(item)
      tdUserContactsContainer.append(itemNum)
    })
    return tdUserContactsContainer
  }

  function showAllContacts() {
    const allButton = document.querySelectorAll(".contacts__item-sum")
    allButton.forEach(element => {
      element.addEventListener('click', () => {
        const allContacts = element.parentNode.querySelectorAll('.contacts__item')
        element.classList.add('display-none')
        allContacts.forEach((contact) => {
          const classList = contact.classList
          classList.forEach(item => {
            if(item === 'display-none') contact.classList.add('display-block')
          })
        })
      })
    })
    return allButton
  }

  function showsUsers(data) {
    const tbody = document.querySelector('tbody')
    tbody.innerHTML = ''
    if(data.length > 0) {
      data.forEach((element) => {
        const tr = document.createElement('tr')
        tr.classList.add('user__row')
        tr.setAttribute('id', element.id)
  
        const tdUserId = document.createElement('td')
        tdUserId.classList.add('user__row-td')
        const tdUserContainer = document.createElement('div')
        tdUserContainer.classList.add('user__td-id')
        tdUserContainer.textContent = getFormatId('' + element.id)
        tdUserId.append(tdUserContainer)
  
        const tdUserName = document.createElement('td')
        tdUserName.classList.add('user__row-td')
        const tdUserNameContainer = document.createElement('div')
        tdUserNameContainer.classList.add('user__row-name')
        tdUserNameContainer.textContent = `${element.surname} ${element.name} ${element.lastName}`
        tdUserName.append(tdUserNameContainer)
  
        const tdUserDateReg = document.createElement('td')
        tdUserDateReg.classList.add('user__row-td')
        const tdUserDateRegContainer = document.createElement('div')
        tdUserDateRegContainer.classList.add('user__row-flex')
        const tdUserDateRegDate = document.createElement('span')
        tdUserDateRegDate.textContent = getFormatDate(element.createdAt)
        const tdUserDateRegTime = document.createElement('span')
        tdUserDateRegTime.classList.add('user__td-time')
        tdUserDateRegTime.textContent = getFormatTime(element.createdAt)
        tdUserDateReg.append(tdUserDateRegContainer)
        tdUserDateRegContainer.append(tdUserDateRegDate)
        tdUserDateRegContainer.append(tdUserDateRegTime)
  
        const tdUserDateUpdate = document.createElement('td')
        tdUserDateUpdate.classList.add('user__row-td')
        const tdUserDateUpdateContainer = document.createElement('div')
        tdUserDateUpdateContainer.classList.add('user__row-flex')
        const tdUserDateUpdateDate = document.createElement('span')
        tdUserDateUpdateDate.textContent = getFormatDate(element.updatedAt)
        const tdUserDateUpdateTime = document.createElement('span')
        tdUserDateUpdateTime.classList.add('user__td-time')
        tdUserDateUpdateTime.textContent = getFormatTime(element.updatedAt)
        tdUserDateUpdate.append(tdUserDateUpdateContainer)
        tdUserDateUpdateContainer.append(tdUserDateUpdateDate)
        tdUserDateUpdateContainer.append(tdUserDateUpdateTime)
  
        const tdUserContacts =  document.createElement('td')
        tdUserContacts.classList.add('user__row-td')
        tdUserContacts.append(createContactAndTooltips(element.contacts))
  
        const tdUserActions = document.createElement('td')
        tdUserActions.classList.add('user__row-td')
        const tdUserActionsContainer = document.createElement('div')
        tdUserActionsContainer.classList.add('user__row-flex', 'user__action-block')
        tdUserActions.append(tdUserActionsContainer)
        tdUserActionsContainer.append(createActionButton('edit', 'Изменить', element))
        tdUserActionsContainer.append(createActionButton('delete', 'Удалить', element))
  
        tr.append(tdUserId)
        tr.append(tdUserName)
        tr.append(tdUserDateReg)
        tr.append(tdUserDateUpdate)
        tr.append(tdUserContacts)
        tr.append(tdUserActions)
  
        tbody.appendChild(tr)
  
        showAllContacts()
      })
    } 
  }

  function preloader() {
    const preloader = document.createElement('div')
    preloader.classList.add('preloader')
    return preloader
  }

  function createTableHeaderTh(arrTitle) {
    const table = document.createElement('table')
    const thead = document.createElement('thead')
    table.classList.add('table')

    const title = arrTitle.map((text, index) => {
      const span = document.createElement('span')
      const th = document.createElement('th')
      th.classList.add('table__th')
      th.textContent = text
      th.setAttribute('id', `th${index + 1}`)
      span.classList.add('arrow')
      span.setAttribute('id', `arrow${index + 1}`)
      if(text === 'Контакты') return th
      if(text === 'Действия') return th
      th.append(span)
      if(text === 'Фамиля Имя Отчество') {
        const sortSpan = document.createElement('span')
        sortSpan.classList.add('sort__span')
        sortSpan.textContent = 'А-Я'
        th.append(sortSpan)
      }
      return th
    })
    thead.append(...title)
    table.append(thead)
    return table
  }

  function createTable() {
    const tbodyContainer = document.createElement('div')
    tbodyContainer.setAttribute('id', 'secondTable')

    function createTableBody() {
      const table = document.createElement('table')
      const tbody = document.createElement('tbody')

      tbodyContainer.append(lazyLoad)

      table.classList.add('table')
      tbodyContainer.classList.add('table__preloader')
      tbodyContainer.append(table)
      table.append(tbody)
      return table
    }

    tbodyContainer.append(createTableBody())

    return tbodyContainer
  }

  function sortTitle(data, sortState) {
    const titles = document.querySelectorAll('.table__th')
    if(sortState.id) {
      titles[0].classList.add('table__th-active')
      titles[0].childNodes[1].classList.toggle('arrow__rotate')
      sortById(data, sortState)
    }
    return data
  }

  function sortById(data, state) {
    data.sort((a,b) => {
      if(state.id) {
        return a.id > b.id ? 1 : -1
      } else {
        return a.id < b.id ? 1 : -1
      }
    })
    state.id = !state.id
    return data
  }

  function sortByInitials(data, state) {
    data.sort((a,b) => {
      const firstUserName = (a.surname + a.name + a.lastName).toLowerCase()
      const secondUserName = (b.surname + b.name + b.lastName).toLowerCase()
      if(state.initials) {
        return firstUserName > secondUserName ? 1 : -1
      } else {
        return firstUserName < secondUserName ? 1 : -1
      }
    })
    state.initials = !state.initials
    return data
  }

  function sortByDate(data, state, type) {
    data.sort((a,b) => {
      a = new Date(a[type]).getTime()
      b = new Date(b[type]).getTime()
      if(state[type]){
        return a > b ? 1 : -1
      } else {
        return a < b ? 1 : -1
      }
    })
    state[type] = !state[type]
    return data
  }

  async function requestSearchUser(request) {
    let url = new URL(`${mainURL}`)
    let newRequest = request.split(' ')
    url.searchParams.append('search', request)
    if(url.search.includes('+')) {
      url.searchParams.delete('search')
      url.searchParams.append('search', newRequest[0])
      newRequest.forEach(value => {
        if(value) {
          url.searchParams.append('&', value)
        }
      })
    }
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  async function requestSearchUserForId(id) {
    const response = await fetch(`${mainURL}/${id}`)
    const data =  await response.json()
    return data
  }

  function createSearchListContainer() {
    const listContainer = document.createElement('div')
    listContainer.classList.add('seacrh__list-container')
    return listContainer
  }

  function createSearchlistItem(data, dist) {
    const result = []
    data.forEach(item => {
      const listItem = document.createElement('div')
      listItem.classList.add('seacrh__list-item')
      listItem.setAttribute('tabindex', `${0}`)
      listItem.setAttribute('data-id', `${item.id}`)
      listItem.textContent = `${item.surname} ${item.name} ${item.lastName}`
      result.push(listItem)

      listItem.addEventListener('click', () => {
        removeFocus()
        switchFocusSearchedItem(item.id)
        clearSearchList()
      })

      window.onclick = e => {
        if(e.target !== listItem) clearSearchList()
      }
    })

    return result.length >= 6 ? dist.append(...result.slice(0, 6)) : dist.append(...result)
  }

  function switchFocusSearchedItem(id) {
    const findElement = document.getElementById(id)
    findElement.classList.add('show__focus-tr')
    findElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  function removeFocus() {
    const allFocus = document.querySelector('.show__focus-tr')
    if(allFocus === null) return
    allFocus.classList.remove('show__focus-tr')
  }

  function clearSearchList() {
    const seacrhList = document.querySelector('.seacrh__list-container')
    seacrhList.innerHTML = ''
  }

  function clearSearchInput() {
    const inputSeacrh = document.querySelector('.input__seacrh')
    inputSeacrh.value = ''
  }

  function closeModal() {
    const modal = document.querySelector('.modal')
    const modalContent = document.querySelector('.modal__content')

    modalContent.classList.toggle('show__content')
    setTimeout(() => {
      body.classList.remove('modal__open')
      modal.classList.toggle('modal__close')
      modal.remove()
    },400)
  }

  function createModal(typeModal, user) {
    const modal = document.createElement('div')
    const modalContent = document.createElement('div')
    const closeButton = document.createElement('button')
    modal.classList.add('modal')
    modalContent.classList.add('modal__content')
    closeButton.classList.add('modal_close-btn')

    modalContent.append(closeButton)
    modal.append(modalContent)
   
    setTimeout(() => {
      modalContent.classList.add('show__content')
    }, 50)

    closeButton.addEventListener('click', () => {
      closeModal()
    })

    window.addEventListener('click', windowHandler)

    function windowHandler(e) {
      if(e.target == modal) closeModal()
    }

    if(typeModal === 'notFound') {
      modalContent.innerHTML = `Пользователь с данным ${user} не найден`
      body.append(modal)
      body.classList.add('modal__open')
      return
    }

    if(typeModal === 'serverError') {
      modalContent.innerText = 'Проблемы с базой данных обратитесь к администратору. Работа приложения остановлена.'
      window.removeEventListener('click', windowHandler)
      body.append(modal)
      body.classList.add('modal__open')
      return
    } else {
      modalContent.append(modalHeader(typeModal, user))
      modalContent.append(modalBody(typeModal, user))
      modalContent.append(modalFooter(typeModal, user))
    }

    
    body.append(modal)
    body.classList.add('modal__open')
    if(typeModal !== 'deleteUser' ) activateDisableButton()
    return modal
  }

  function modalHeader(typeModal, userId = null) {
    const header = document.createElement('div')
    const headerTitle = document.createElement('h3')

    header.classList.add('modal__header-container')
    headerTitle.classList.add('form__title')

    if(typeModal === 'newUser') headerTitle.textContent = 'Новый клиент'
    if(typeModal === 'changeUser') {
      headerTitle.textContent = 'Изменить данные'
      const id = document.createElement('span')
      headerTitle.append(id)
      id.classList.add('form__title-id')
      id.textContent = `ID: ${userId.id}`
    }
    if(typeModal === 'deleteUser') {
      headerTitle.textContent = 'Удалить клиента'
      headerTitle.style.textAlign = 'center'
    }

    header.append(headerTitle)

    return header
  }

  function modalBody(typeModal, user) {
    const form = document.createElement('form')
    form.classList.add('placeholder-form')

    if(typeModal !== 'deleteUser') {

      const blockSurname = document.createElement('div')
      blockSurname.classList.add('placeholder-container')
      const surnameInput = document.createElement('input')
      surnameInput.setAttribute('type', 'text')
      surnameInput.setAttribute('id', 'surname')
      surnameInput.setAttribute('placeholder', ' ')
      const surnameLabel = document.createElement('label')
      surnameLabel.textContent = `Фамилия` 
      surnameLabel.append(requreInput())
      blockSurname.append(surnameInput)
      blockSurname.append(surnameLabel)
      form.append(blockSurname)

      const blockName = document.createElement('div')
      blockName.classList.add('placeholder-container')
      const nameInput = document.createElement('input')
      nameInput.setAttribute('type', 'text')
      nameInput.setAttribute('id', 'name')
      nameInput.setAttribute('placeholder', ' ')
      const nameLabel = document.createElement('label')
      nameLabel.textContent = `Имя`
      nameLabel.append(requreInput())
      blockName.append(nameInput)
      blockName.append(nameLabel)
      form.append(blockName)

      const blockLastName = document.createElement('div')
      blockLastName.classList.add('placeholder-container')
      const lastNameInput = document.createElement('input')
      lastNameInput.setAttribute('type', 'text')
      lastNameInput.setAttribute('id', 'lastName')
      lastNameInput.setAttribute('placeholder', ' ')
      const lastNameLabel = document.createElement('label')
      lastNameLabel.textContent = 'Отчество'
      blockLastName.append(lastNameInput)
      blockLastName.append(lastNameLabel)
      form.append(blockLastName)

      if(typeModal === 'changeUser') {
        disabledInputs(form)

        lastNameInput.value = user.lastName
        surnameInput.value = user.surname
        nameInput.value = user.name

        activeteInputs(form)
      }

      form.append(createContactsBody(user, typeModal))
      return form
    } else {
      const messageDelete = document.createElement('span')
      messageDelete.classList.add('messageDelete')
      messageDelete.textContent = 'Вы действительно хотите удалить данного клиента?'

      form.append(messageDelete)
      return form
    }
    
  }

  function disabledInputs(dist) {
    const allInput = dist.querySelectorAll('input')
      allInput.forEach(input => {
        input.setAttribute('disabled', 'true')
        input.classList.add('disabled-input')
      })
  }

  function activeteInputs(dist) {
    const allInput = dist.querySelectorAll('input')
    setTimeout(() => {
      allInput.forEach(input => {
        input.removeAttribute('disabled')
        input.classList.remove('disabled-input')
      })
    }, DELAY + 300)
  }

  function modalFooter(typeModal, user) {
    const footer = document.createElement('div')
    footer.classList.add('footer__form')

    const error = document.createElement('p')
    error.classList.add('form__error')

    const mainButton = document.createElement('button')
    mainButton.classList.add('save__form')
    mainButton.setAttribute('type', 'button')
    mainButton.textContent = 'Сохранить'
    
    const otherButton = document.createElement('button')
    otherButton.classList.add('form__error-btn')
    
    mainButton.addEventListener('click', async (e) => {
      e.preventDefault()
      if(typeModal === 'deleteUser') {
        const response = await deleteUser(user)
        const errorRespone = catchResponse(response, error)
        data = await getData()
        disableActionButton()

        if(!errorRespone) return

        setTimeout(() => {
          showsUsers(data)
          closeModal()
        }, DELAY)
      } else {
        if(validationForm()) {
          const container = document.querySelector('.modal__content')
          const value = getValuesInput()
          if(typeModal === 'newUser') {
            const response = await addUser(value)
            const errorRespone = catchResponse(response, error)
            data = await getData()

            disabledInputs(container)
            disableActionButton()

            if(!errorRespone) return
            
            setTimeout(() => {
              showsUsers(data)
              closeModal()
            }, DELAY)
          }
          if(typeModal === 'changeUser') {
            const response = await editUser(value, user.id)
            const errorRespone = catchResponse(response, error)
            data = await getData()

            disabledInputs(container)
            disableActionButton()

            if(!errorRespone) return

            setTimeout(() => {
              showsUsers(data)
              closeModal()
            }, DELAY)
          }
        }
      }
    })

    otherButton.addEventListener('click', (e) => {
      e.preventDefault()

      if(otherButton.textContent === 'Отмена') closeModal()
      if(otherButton.textContent === 'Удалить клиента') {
        closeModal()
        setTimeout(() => {
          createModal('deleteUser', user)
        }, 400)
      }
    })
    
    footer.append(error)

    if(typeModal === 'deleteUser') {
      mainButton.textContent = 'Удалить'
      otherButton.textContent = 'Отмена'
      footer.append(mainButton)
      footer.append(otherButton)
    } else {
      mainButton.textContent = 'Сохранить'
      footer.append(mainButton)
    }
    
    if(typeModal === 'newUser') {
      otherButton.textContent = 'Отмена'
      footer.append(otherButton)
    }

    if(typeModal === 'changeUser') {
      otherButton.textContent = 'Удалить клиента'
      footer.append(otherButton)
    }

    return footer
  }

  function disableActionButton() {
    const button = document.querySelector('.save__form')
    button.setAttribute('disabled', true)
  }

  function catchResponse(response, errorContainer) {
    const status = response.status
    const errorText = response.statusText
    if(status >= 0 && status <= 399) return true
    if(status >= 400 && status <= 499) errorContainer.textContent = errorText
    if(status >= 500 && status <= 599) errorContainer.textContent = errorText
    if(typeof status !== 'number') errorContainer.textContent = 'Что-то пошло не так...'
    if(typeof errorText.length === 0) errorContainer.textContent = 'Что-то пошло не так...'

    if(errorContainer.textContent.length === 0) return true
    else return false
  }

  async function deleteUser(user) {
    const response = await fetch(`${mainURL}/${user.id}`, {
      method: 'DELETE',
    })

    return response
  }

  async function addUser(objUser) {
    const response = await fetch(mainURL, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(objUser)
    })

    return response
  }

  async function editUser(objUser, id) {
    const response = await fetch(`${mainURL}/${id}`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objUser),
    })
    return response
  }

  function requreInput() {
    const requre = document.createElement('span')
    requre.classList.add('requre')
    requre.textContent = '*'

    return requre
  }

  function createContactsBody(user, typeModal) {
    const contactsForm = document.createElement('div')
    contactsForm.classList.add('contacts__form')

    const { contactsContainer, addButton } = createContactsWraperAndButton(user, typeModal)

    if(typeModal === 'changeUser') {
      activeteInputs(contactsContainer)
      disabledInputs(contactsContainer)
    }

    contactsForm.append(contactsContainer)
    contactsForm.append(addButton)

    return contactsForm
  }

  function createContactsWraperAndButton(user = null, typeModal) {
    const contactsContainer = document.createElement('div')
    contactsContainer.classList.add('contacts__form-container')

    const addButton = document.createElement('button')
    addButton.classList.add('add-button__form')
    addButton.setAttribute('type', 'button')
    addButton.innerHTML = `<svg class='add-button-svg__form' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.99998 4.66683C7.63331 4.66683 7.33331 4.96683 7.33331 5.3335V7.3335H5.33331C4.96665 7.3335 4.66665 7.6335 4.66665 8.00016C4.66665 8.36683 4.96665 8.66683 5.33331 8.66683H7.33331V10.6668C7.33331 11.0335 7.63331 11.3335 7.99998 11.3335C8.36665 11.3335 8.66665 11.0335 8.66665 10.6668V8.66683H10.6666C11.0333 8.66683 11.3333 8.36683 11.3333 8.00016C11.3333 7.6335 11.0333 7.3335 10.6666 7.3335H8.66665V5.3335C8.66665 4.96683 8.36665 4.66683 7.99998 4.66683ZM7.99998 1.3335C4.31998 1.3335 1.33331 4.32016 1.33331 8.00016C1.33331 11.6802 4.31998 14.6668 7.99998 14.6668C11.68 14.6668 14.6666 11.6802 14.6666 8.00016C14.6666 4.32016 11.68 1.3335 7.99998 1.3335ZM7.99998 13.3335C5.05998 13.3335 2.66665 10.9402 2.66665 8.00016C2.66665 5.06016 5.05998 2.66683 7.99998 2.66683C10.94 2.66683 13.3333 5.06016 13.3333 8.00016C13.3333 10.9402 10.94 13.3335 7.99998 13.3335Z"/></svg>Добавить контакт`
    
    addButton.addEventListener('click', (e) => {
      e.preventDefault()
      contactsContainer.append(createContactsFields())
      activateDisableButton()
    })

    if(typeModal === 'changeUser') {
      const contacts = user.contacts
      contacts.forEach(contact => {
        contactsContainer.append(createContactsFields(contact))
      })
    }

    return {
      contactsContainer,
      addButton
    }
  }

  function activateDisableButton() {
    const button = document.querySelector('.add-button__form')
    const rows = document.querySelectorAll('.custom__select')

    if(rows.length > 0 && rows.length < 10) {
      button.classList.remove('show__add-button')
      button.style.marginTop = '25px'
      button.style.marginBottom = '25px'
    } 
    if(rows.length === 0) {
      button.style.marginTop = '0px'
      button.style.marginBottom = '0px'
    }
    if(rows.length === 10) {
      button.classList.add('show__add-button')
      button.style.marginTop = '0px'
      button.style.marginBottom = '0px'
    }
  }

  function createContactsFields(contact) {
    const selectData = ['Телефон', 'Email', 'Facebook', 'VK', 'Другое']

    const wraper = document.createElement('div')
    wraper.classList.add('custom__select')

    const buttonTitle = document.createElement('button')
    buttonTitle.classList.add('custom__select-title')
    buttonTitle.setAttribute('type', 'button')

    const buttonText = document.createElement('span')
    buttonText.innerText = 'Телефон'
    buttonTitle.append(buttonText)

    const buttonArrow = document.createElement('div')
    buttonArrow.classList.add('custom__select-title-arrow')
    buttonTitle.append(buttonArrow)

    const list = document.createElement('ul')
    list.classList.add('custom__select-list')

    const newInput = document.createElement('input')
    newInput.setAttribute('type', `tel`)
    newInput.setAttribute('class', `contact-input`)
    newInput.setAttribute('placeholder', `Введите данные контакта`)
    newInput.setAttribute('data-input', `${buttonText.textContent}`)

    const tooltipText = document.createElement('span')
    tooltipText.classList.add('contacts__item-tooltip', 'position__popap')

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('custom__select-delete-btn')
    deleteButton.setAttribute('type', 'button')
    deleteButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"/></svg>`
    deleteButton.append(tooltipText)
    tooltipText.textContent = 'Удалить контакт'

    wraper.append(buttonTitle)

    const mask = '+x(xxx) xxx-xx-xx'
    let res = mask

    function telHandler(e) {    
      const data = e.data
      const isNum = /\d/.test(data)
      if(!isNum && !!data) return e.target.value = res
      if(data) {
        res = res.replace('x', data)
      } else {
        const reversed = reverseString(res)
        res = reverseString(reversed.replace(/\d/, 'x'))
      }
      e.target.value = res
    }
    newInput.addEventListener('input', telHandler)
    

    selectData.forEach(item => {
      const listItem = document.createElement('li')
      listItem.classList.add('custom__select-item')
      listItem.innerText = item
      list.append(listItem)
      wraper.append(newInput)
      wraper.append(deleteButton)
      
      listItem.addEventListener('click', () => {
        buttonText.innerText = listItem.innerText
        list.classList.toggle('show__select-list')
        buttonArrow.classList.toggle('title-arrow-rorate')
        changeTelInput(buttonText.textContent, newInput)
        newInput.setAttribute('data-input', `${buttonText.textContent}`)

        if(newInput.getAttribute('type') !== `tel`) {
          newInput.value = ''
          newInput.removeEventListener('input', telHandler)
        } else {
          newInput.value = ''
          newInput.addEventListener('input', telHandler)
        }
      })
    })

    deleteButton.addEventListener('click', (e) => {
      e.preventDefault()
      wraper.remove()
      activateDisableButton()
    })

    wraper.append(list)

    buttonTitle.addEventListener('click', (e) => {
      e.preventDefault()
      list.classList.toggle('show__select-list')
      buttonArrow.classList.toggle('title-arrow-rorate')
    })

    if(contact) {
      buttonText.textContent = contact.type
      newInput.value = contact.value
      changeTelInput(buttonText.textContent, newInput)
      newInput.setAttribute('data-input', `${buttonText.textContent}`)
      if(newInput.getAttribute('type') !== `tel`) {
        newInput.removeEventListener('input', telHandler)
      } else {
        newInput.addEventListener('input', telHandler)
      }
    }
    return wraper
  }

  function reverseString(str) {
    return str.split('').reverse().join('')
  }

  function changeTelInput(type, input) {
    switch (type) {
      case 'Телефон': 
        input.setAttribute('type', 'tel')
        break
      default:
        input.setAttribute('type', 'text')
        break
    }
  }

  function buttonAddUser(text) {
    const btn = document.createElement('button')
    btn.classList.add('add__button')
    btn.innerHTML = `
      <svg width="23" height="16" viewBox="0 0 23 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z" fill="#9873FF"/>
      </svg>    
      <span>${text}</span>
    `

    btn.addEventListener('click', () => {
      createModal('newUser')
    })

    return btn
  }

  function getValuesInput() {
    const form = document.querySelector('.placeholder-form')
    const allInputs = form.querySelectorAll('input')
    const userState = {
      name: '',
      surname: '',
      lastName: '',
      contacts: []
    }

    allInputs.forEach(input => {
      if(input.id === 'name') userState.name = input.value.trim()
      if(input.id === 'surname') userState.surname = input.value.trim()
      if(input.id === 'lastName') userState.lastName = input.value.trim()
    })

    const contactsInputs = document.querySelectorAll('.contact-input')

    contactsInputs.forEach(contactInput => {
      userState.contacts.push({
        type: `${contactInput.getAttribute('data-input')}`,
        value: `${contactInput.value.trim()}`
      })
    })
    
    return userState
  }

  function validationForm() {
    const form = document.querySelector('.placeholder-form')
    const allInputs = form.querySelectorAll('input')
    const error = document.querySelector('.form__error')
    let validation = true

    allInputs.forEach(input => {
      if(input.id !== 'lastName') {
        if(!input.value.trim()) {
          input.classList.add('validation__input')
          error.style.opacity = 1
          error.textContent = 'Вам необходимо заполнить все подсвеченные поля ввода'
          validation = false
        } 
        else {
          input.classList.remove('validation__input')
        }
      }

      input.addEventListener('input', () => {
        input.classList.remove('validation__input')
        const validCount = document.querySelectorAll('.validation__input')
        if(validCount.length === 0) error.textContent = ''
      })
    })

    return validation
  }

  function focusSearchItem(listItem, listArr) {
    if(typeof listItem === 'undefined') return
    listArr.forEach(item => {
      item.classList.remove('seacrh__list-item-focus')
    })
    listItem.classList.add('seacrh__list-item-focus')
  }

  async function runApp() {
    
    let data = await getData()

    if(data.message) {
      createModal('serverError') 
      disabledInputs(document)
    }

    const tableContainer = document.createElement('div')
    tableContainer.classList.add('table__container')
    const { form, input } = createSearchInput('seacrh', 'Введите имя', 'input__seacrh')
    const listContainer = createSearchListContainer()
    form.append(listContainer)
    header.append(form)

    tableContainer.append(createTitle('Контакты', 'main__title'))
    tableContainer.append(createTableHeaderTh(['ID', 'Фамиля Имя Отчество', 'Дата и время создания', 'Последние изменения', 'Контакты', 'Действия']))
    tableContainer.append(createTable())

    container.append(tableContainer)
    const titles = document.querySelectorAll('.table__th')
    sortTitle(data, sortState)

    setTimeout(() => {
      lazyLoad.remove()
      showsUsers(data)
    }, DELAY)
    container.append(buttonAddUser('Добавить пользователя'))
    
    let timerInput
    input.addEventListener('input', () => {
      const value = input.value
      listContainer.innerHTML = ''
      listContainer.style.opacity = 1

      if(value) {
        clearTimeout(timerInput)
        timerInput = setTimeout(async () => {
          const data = await requestSearchUser(value)
          showsUsers(data)
          createSearchlistItem(data, listContainer)
        }, DELAY)
      }
      if(!value) {
        listContainer.style.opacity = 0
        clearTimeout(timerInput)
        timerInput = setTimeout(() => {
          showsUsers(data)
        }, DELAY)
      }
    })

    let count = -1
    form.addEventListener('keydown', (e) => {
      const listSearch = document.querySelectorAll('.seacrh__list-item')
      if(listSearch.length) {
        if(e.key === 'ArrowDown') {
          if(count === listSearch.length - 1) count = listSearch.length - 2
          count++
          focusSearchItem(listSearch[count], listSearch)
        }
        if(e.key === 'Tab') {
          if(count === listSearch.length - 1) count = listSearch.length - 2
          count++
          focusSearchItem(listSearch[count], listSearch)
        }
        if(e.key === 'ArrowUp') {
          if(count <= 0) count = 1
          count--
          focusSearchItem(listSearch[count], listSearch)
        }
        if(e.key === 'Enter') {
          e.preventDefault()
          try {
            switchFocusSearchedItem(listSearch[count].getAttribute('data-id'))
            clearSearchList()
            count = -1
          } catch (error) {
            clearSearchList()
          }
        }
        if(e.key === 'Escape') {
          clearSearchList()
          showsUsers(data)
          count = -1
        }
      }
      if(e.key === 'Enter') {
        e.preventDefault()
      }
    })

    const hash = location.hash.slice(1)
    if(!!hash) {
      const user = await requestSearchUserForId(hash)
      if(user.message) return createModal('notFound', hash) 
      createModal('changeUser', user) 
    }

    titles.forEach((title, index) => {
      title.addEventListener('click', async (e) => {
        let data = await getData()
        if(index <= 3) {
          titles.forEach(nontarget => {
            nontarget.classList.remove('table__th-active')
          })
          if(e.target.id === title.id) {
            title.classList.add('table__th-active')
            title.childNodes[1].classList.toggle('arrow__rotate')
          } 
          if(title.id === 'th1') data = sortById(data, sortState)
          if(title.id === 'th3') data = sortByDate(data, sortState, 'createdAt')
          if(title.id === 'th4') data = sortByDate(data, sortState, 'updatedAt')
          if(title.id === 'th2') {
            data = sortByInitials(data, sortState)
            if(title.childNodes[2].textContent === 'А-Я') {
              title.childNodes[2].innerText = 'Я-А'
            } else {
              title.childNodes[2].innerText = 'А-Я'
            }
          }
          showsUsers(data)
        }
      })
    })
  }
  runApp()
})()
