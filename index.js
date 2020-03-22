(function () {
  //new variable
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
  const INDEX_URL = BASE_URL + '/api/v1/users/'
  const dataPanel = document.querySelector('#data-panel')
  const data = []
  const modalBody = document.querySelector('.modal-body')

  //request data
  axios.get(INDEX_URL)
    .then(res => {
      data.push(...res.data.results)
      displayDataList(data)
      console.log(data[0])
    }).catch(err => console.log(err))

  //display data
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(item => {
      htmlContent += `
        <div class="wrapper"  data.id="${item.id}">
          <div class="file-img">
            <img class="avatar" data-id="${item.id}" data-toggle="modal" data-target="#profileModal" src="${item.avatar}">
          </div>
          <div class="${item.gender}-color"></div>
          <div class="file-content">
            <div class="name">${item.name}</div>
            <div class="region mb-2">${item.region}</div>
            <div class="age mb-3"> <i class="gender-icon ${item.gender} mr-3"></i>${item.age}</div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
    addIcon()
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

  //click photo and trigger modal
  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.avatar')) {
      modalBody.innerHTML = ''
      displayProfile(event.target.dataset.id)
    }
  })

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
          <ul>
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

})()