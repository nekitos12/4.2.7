const searchInput=document.querySelector('.search__input')
const repoList=document.querySelector('.repo__list')
const autocomList=document.querySelector('.autocom__list')


const search= debounce(searchRepo, 500)
searchInput.addEventListener('keyup', search)

async function searchRepo (){
    autocomList.innerHTML=''
    return await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`)
    .then(res => {
        return res.json()
    })
    .then(res => {
        const currentSearch=[]
        res.items.forEach(elem => {
            currentSearch.push(elem.name)
        })
        const arr = [...new Set(currentSearch)].filter((elem,i)=> i<5)
        arr.forEach(elem=> {
            const autocomElem = createAutocom(elem)
            autocomElem.addEventListener('click', ()=> {
                searchInput.value=''
                autocomList.innerHTML=''
                let index = currentSearch.indexOf(elem)
                const currentItem = res.items[index];
                const repoEl = createRepo(currentItem)
                const deleteBtn = repoEl.querySelector('.repo__delete')
                deleteBtn.addEventListener('click',()=>{
                    repoList.removeChild(repoEl)
                })
            })
        })
        
    })

};


function createAutocom (elem){
    const htmlElement=createElement('li','autocom__item')
    htmlElement.innerHTML= `${elem}`
    autocomList.appendChild(htmlElement)
    return htmlElement
}

function createRepo (elem){
    const htmlElement=createElement('li','repo__item')
    htmlElement.innerHTML= `<div class="repo__descr">
    <div class="repo__name">Name: ${elem.name}</div>
    <div class="repo__owner">Owner: ${elem.owner.login}</div>
    <div class="repo__stars">Stars: ${elem.watchers}</div>
  </div>
  <button class="repo__delete"></button>`
    repoList.appendChild(htmlElement)
    return htmlElement
}

function createElement (elementTag, elementClass){
    const element = document.createElement(elementTag)
    if (elementClass){
        element.classList.add(elementClass)
    }
    return element
}
function debounce (fn, debounceTime)  {
    let timeout
    return function (...args){
        const fnCall = ()=>{ fn.apply(this,args)}
        clearTimeout(timeout)
        timeout = setTimeout(fnCall, debounceTime)
    }
};



