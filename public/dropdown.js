const dropdowns= document.querySelectorAll('[data-dropdown]');
if(dropdowns.length>0)
{
    dropdowns.forEach(dropdown=>{
        createCustomDropdown(dropdown);
    });
}

function createCustomDropdown(dropdown)
{
    const options= dropdown.querySelectorAll('option');
    const optionsArr= Array.prototype.slice.call(options);
    
    const initialSelectedOption=optionsArr.find(option=>{
        if(option.value==dropdown.value)
            return true;
    });

    const customDropdown= document.createElement('div');
    customDropdown.classList.add('dropdown');
    dropdown.insertAdjacentElement('afterend',customDropdown);

    const selected=document.createElement('div');
    selected.classList.add('dropdown-selected');
    selected.textContent=initialSelectedOption.textContent;
    customDropdown.appendChild(selected);

    const menu=document.createElement('div');
    menu.classList.add('dropdown-menu');
    customDropdown.appendChild(menu);
    selected.addEventListener('click', toggleDropdown.bind(menu));

    const search= document.createElement('input');
    search.placeholder='Search...';
    search.type='text';
    search.classList.add('dropdown-menu-search');
    menu.appendChild(search);

    const menuItemsWrapper= document.createElement('div');
    menuItemsWrapper.classList.add('dropdown-menu-items');
    menu.appendChild(menuItemsWrapper);

    optionsArr.forEach(option=>{
        const item= document.createElement('div');
        item.classList.add('dropdown-menu-item');
        item.dataset.value=option.value;
        item.textContent= option.textContent;
        if(item.dataset.value==dropdown.value)
            item.classList.add('selected');
        
        menuItemsWrapper.appendChild(item);
        item.addEventListener('click', setSelected.bind(item,selected,dropdown,menu));
    });

    search.addEventListener('input',filterItems.bind(search,optionsArr,menu));
    document.addEventListener('click',closeIfClickedOutside.bind(customDropdown,menu));
    dropdown.style.display='none';
}

function toggleDropdown()
{
    if(this.offsetParent!==null)
    {
        this.style.display='none';
    }
    else
    {
        this.style.display='block';
        this.querySelector('input').focus();
    }
}

function setSelected(selected,dropdown,menu)
{
    const value=this.dataset.value;
    const label=this.textContent;
    selected.textContent=label;
    dropdown.value=value;

    menu.style.display='none';
    menu.querySelector('input').value='';
    menu.querySelectorAll('div').forEach(div=>{
        if(div.classList.contains('selected'))
        {
            div.classList.remove('selected');
        }
        if(div.offsetParent===null)
            div.style.display='block';
    });
    this.classList.add('selected');
}

function filterItems(itemsArr,menu)
{
    const customOptions=menu.querySelectorAll('.dropdown-menu-items div');
    const substring=this.value.toLowerCase();
    const filteredItems= itemsArr.filter(item=>item.textContent.toLowerCase().includes(substring));
    const indexesArr= filteredItems.map(item=> itemsArr.indexOf(item));

    itemsArr.forEach(option=>{
        if(!indexesArr.includes(itemsArr.indexOf(option)))
        {
            customOptions[itemsArr.indexOf(option)].style.display='none';
        }
        else
        {
            if(customOptions[itemsArr.indexOf(option)].offsetParent===null)
            {
                customOptions[itemsArr.indexOf(option)].style.display='block';
            }
        }
    });
}

function closeIfClickedOutside(menu,e)
{
    if(e.target.closest('.dropdown')===null && e.target!==this && menu.offSetParent !==null)
    {
        menu.style.display='none';
    }
}
