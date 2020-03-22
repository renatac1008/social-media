(function () {
  //new variable
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const dataPanel = document.querySelector('#data-panel')
  const data = []
  const modalBody = document.querySelector('.modal-body')
  //serach
  const searchForm = document.querySelector('#search')
  const searchInput = document.querySelector('#search-input')
  //pagination
  const pagination = document.querySelector('#pagination')
  const ITEM_PER_PAGE = 12
  //modecontrol
  const modeControl = document.querySelector('#mode-control')
  let currentPage = 1
  let displayMode = 'card'
  //serach gender
  const searchButtons = document.querySelector('#search-buttons')
  const myFavoriteListData = JSON.parse(localStorage.getItem('myFavoriteList')) || []
  //request data
  axios.get(INDEX_URL)
    .then(res => {
      data.push(...res.data.results)
      getTotalPages(data)
      getPageData(1, data)
    }).catch(err => console.log(err))

  //display in card mode
  function displayInCards(data) {
    let htmlContent = ''
    data.forEach(item => {
      const { id, avatar, gender, name, region, age } = item
      htmlContent += `
        <div class="wrapper"  data.id="${id}">
          <div class="file-img">
            <img class="avatar" data-id="${id}" data-toggle="modal" data-target="#profileModal" src="${avatar}">
          </div>
          <div class="${gender}-color"></div>
          <div class="file-content">
            <div class="name"><i class="add-favorite far fa-heart mr-3" data-id="${id}" ></i>${name}</div>
            <div class="region mb-2">${region}</div>
            <div class="age mb-3"> <i class="gender-icon ${gender} mr-3"></i>${age}</div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
    addIcon()
    showFavoriteIcon()
  }
  //display in list mode
  function displayInList(data) {
    let htmlContent = '<ul class="list-group list-group-flush">'
    data.forEach(item => {
      const { id, avatar, gender, name, region, age } = item
      htmlContent += `     
        <li class="list-group-item list-group-item-action d-flex align-items-center px-5">
          <img class="list-avatar" data-id="${id}" data-toggle="modal" data-target="#profileModal" src="${avatar}">
          <div class="list-name"><i class="add-favorite far fa-heart mr-3" data-id="${id}"></i>${name}</div>
          <div class="list-region">${region}</div>
          <div class="list-age"> <i class="gender-icon ${gender} mr-3"></i>${age}</div>
        </li>
      `
    })
    htmlContent += '</ul>'
    dataPanel.innerHTML = htmlContent
    addIcon()
    showFavoriteIcon()
  }
  //add gender icon
  function addIcon() {
    const genderIcon = document.querySelectorAll('.gender-icon')
    genderIcon.forEach(item => {
      if (item.matches('.female')) {
        item.classList.add('fas', 'fa-venus')
      } else { item.classList.add('fas', 'fa-mars') }
    })
  }
  //show favorite icon
  function showFavoriteIcon() {
    const favoriteIcon = document.querySelectorAll('.add-favorite')
    favoriteIcon.forEach(item => {
      if (myFavoriteListData.some(profile => profile.id === Number(item.dataset.id))) {
        item.classList.add('fas')
      }
    })
  }
  //display profile in modal 
  function displayProfile(id) {

    const url = INDEX_URL + id
    axios.get(url)
      .then(res => {
        const data = res.data
        modalBody.innerHTML = `
        <div id="modal-img">
          <img id="modal-avatar" src=${data.avatar}> 
        </div>
        <div id="profile-detail">
          <ul class="modal-information">
            <li id="modal-name" class="pb-2">${data.name} ${data.surname}</li>
            <li id="modal-birthday" class="pt-2"><i class="mr-2 fas fa-birthday-cake"></i>${data.birthday}  age :${data.age}</li>
            <li id="modal-region" class="py-1"><i class="mr-2 fas fa-map-marker-alt"></i></i>${data.region}</li>
            <li id="modal-email" ><i class="mr-2 fas fa-envelope"></i>${data.email}</li>
            <li id="created-time" class="mt-3">created at ${data.created_at}</li>
            <li id="updated-at">updates at ${data.updated_at}</li>
          </ul>
        </div>
        `
      }).catch(err => console.log(err))


  }
  //add pagination
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
<li class="page-item">
<a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
</li>
`
    }
    pagination.innerHTML = pageItemContent
  }
  //get page data and display data
  let paginationData = []
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    currentPage = pageNum || currentPage
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    if (displayMode === 'card') {
      displayInCards(pageData)
    } else if (displayMode === 'list')
      displayInList(pageData)
  }
  //add to favorite list
  function manageFavorite(id) {
    const profile = data.find(item => item.id === Number(id))

    if (myFavoriteListData.some(item => item.id === Number(id))) {
      const index = myFavoriteListData.findIndex(item => item.id === Number(id))
      if (index === -1) return
      myFavoriteListData.splice(index, 1)
      localStorage.setItem('myFavoriteList', JSON.stringify(myFavoriteListData))
    } else {
      myFavoriteListData.push(profile)
    }
    localStorage.setItem('myFavoriteList', JSON.stringify(myFavoriteListData))

  }

  //click photo and trigger modal & add favorite
  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.avatar') || event.target.matches('.list-avatar')) {
      modalBody.innerHTML = ''
      displayProfile(event.target.dataset.id)
    } else if (event.target.matches('.add-favorite')) {
      if (event.target.matches('.fas')) {
        event.target.classList.remove('fas')
      } else {
        event.target.classList.add('fas')
      }
      manageFavorite(event.target.dataset.id)
    }
  })

  //listen to search form submit event
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    // let input = searchInput.value
    // let results = data.filter(movie => movie.title.toLowerCase().includes(input))
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(file => file.region.match(regex))
    getTotalPages(results)
    getPageData(1, results)
  })

  //listen to pagination click event
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      currentPage = event.target.dataset.page
      getPageData(currentPage)
    }
  })

  //listen to mode-control click event
  modeControl.addEventListener('click', event => {
    if (event.target.matches('#card-mode')) {
      displayMode = 'card'
      getPageData(currentPage)
    } else if (event.target.matches('#list-mode')) {
      displayMode = 'list'
      getPageData(currentPage)
    }
  })

  //listen to serach-gender click event
  searchButtons.addEventListener('click', event => {
    let result = []
    if (event.target.matches('.fa-male')) {
      results = data.filter(file => file.gender === 'male')
    } else if (event.target.matches('.fa-female')) {
      results = data.filter(file => file.gender === 'female')
    } else if (event.target.matches('.show-my-favorite')) {
      results = myFavoriteListData
    } else if (event.target.matches('.show-all')) {
      results = data
    }
    getTotalPages(results)
    getPageData(1, results)
  })

})()