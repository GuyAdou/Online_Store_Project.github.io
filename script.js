"use strict"

function changeImage(clickedImage){
    var main_image = document.querySelector("#main-image");
    var start_image = main_image.src;
    var start_image_alt = main_image.alt;
    main_image.src= clickedImage.src;
    main_image.alt=clickedImage.alt;
    clickedImage.src = start_image;
    clickedImage.alt = start_image_alt;
 }

var $ = function $(variable){
    return document.querySelector(variable);
 }

 const api_url ="https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/"; 

function showElement(sthgToShow){
    return $(sthgToShow).classList.remove('hide')
}

 function hideElement(sthgToHide){
    console.log(sthgToHide)
    return $(sthgToHide).classList.add('hide')
 }

 async function getAPiData(url){
     try{
         let connection = await fetch(url);
         return await connection.json();
     }catch(error){
         console.log(error);
     }
 }

 async function processCategories(){
         /*
             - get category form API
             - hide the "loading " in the nav
             - show the radio and label for each categoty inside <nav>
         */
         hideElement("#itemView");
         let results = await getAPiData (api_url+"categories");
         let html = `<span>Filter: </span>`
         results.forEach(item => {
             let htmlSegment = 
                 `<label>
                     <input type="radio" name="category" onclick="processItems(${item.id});">${item.name}</label>`;
                     html+= htmlSegment;
         });

         let categoryContainer = document.querySelector('nav');
         categoryContainer.innerHTML = html;
     }

  

 async function processItems(category){
     console.log("got processed items");
     let results = await getAPiData(api_url+ "categories/"+category+"/items")
     console.log(results);

    let html = '';
    results.items.forEach(item => {
        let htmlSegment = 
            `<tr>
                <td rowspan="1" scope="row" headers="itemimage" class="colitem" onclick = "displayItem(${item.categoryId},${item.itemId})";><img id= itemViewImages src="${item.image[0]}" alt=""></td>
                <td rowspan="1" scope="row" headers="itemName" class="colitem">${item.itemName}</td>
                <td rowspan="1" scope="row" headers="Description" class="colitem">${item.itemFull}</td>
                <td rowspan="1" scope="row" headers="Price" class="colitem">${item.price}</td>
            </tr>`;
        html+= htmlSegment;
    })

    console.log(html);
    let tableContent = $("tbody");

    if (tableContent) {
        tableContent.innerHTML = html;
      } else {
        console.log("The element does not exist.");
      }
   
 }

 async function displayItem(itemid,prdId) {
	
    hideElement("nav")
    hideElement("table")
    showElement("#itemView")

    let results = await getAPiData(api_url+ "categories/"+itemid+`/items/${prdId}`);
    //https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/categories/2/items/a0341b6e-95ef-4317-869c-62f5df839ffa
    console.log(results);
    let html="";

    var clickedItem = 0;
    clickedItem = Object.values(results);
    let itemSizes = clickedItem[6];
    let itemColor = clickedItem[7];
    let itemImages = clickedItem[8];

    $("#itemView h2 span:first-child").textContent = clickedItem[2];
    $("#itemView_price").textContent = `$${clickedItem[5]}`;
    
    //displaying the options
    let sizeOptions = '';
    itemSizes.forEach(item => {
        sizeOptions += `<option value="${item}">${item}</option>`;
    });
    $("#itemSizeSelection").innerHTML = sizeOptions;

    let colorOptions = '';
    itemColor.forEach(color => {
    colorOptions += `<option value="${color}">${color}</option>`;
    });
    $("#itemColor").innerHTML = colorOptions;

    let QtyOptions='';
    for (let i =0; i<10; i++){
       QtyOptions+= `<option value="qty">${i}</option>`;
    }
    $("#ItemQty").innerHTML = QtyOptions;

    

    //displaying images from API
    let htmlSegment = `
    </article>
    <div class=" gallery-container">
        <div class="current-image">
            <img src="${clickedItem[8][0]}" alt="${clickedItem[2]}" id="main-image">
        </div>
        </div>
        <div class="thumbnail-images">
            <img src="${clickedItem[8][1]}" alt="${clickedItem[2]}" onclick="changeImage(this)">
            <img src="${clickedItem[8][2]}" alt="${clickedItem[2]}" onclick="changeImage(this)">
            <img src="${clickedItem[8][3]}" alt="${clickedItem[2]}" alt="photo4" onclick="changeImage(this)" >
        </div>
    </div>
    `  

    html+= htmlSegment;

   console.log(html);
   let galleryContent = $(".gallery-container");
   if (galleryContent) {
        galleryContent.innerHTML = html;
     } else {
       console.log("The element does not exist.");
     }

}

function hideItem() {
	/*
		- clear item elements
		- hide #itemView
		- show <nav> #categories
		- show #listView
        
	*/
    hideElement("#itemView")
    showElement("nav")
    showElement("table")
}



 document.addEventListener('DOMContentLoaded',processCategories)