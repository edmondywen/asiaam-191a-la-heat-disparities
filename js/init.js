const myMap = L.map('mapArea').setView([34.050328, -118.243279], 14);
const url = "https://spreadsheets.google.com/feeds/list/1efuxzpx0k9ZMFdM5_gxS9qlOSSh9a1zy7rBR_NtB1lA/othhvsm/public/values?alt=json"

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function formatData(theData){
    const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
    const rows = theData.feed.entry
    for(const row of rows) {
      const formattedRow = {}
      for(const key in row) {
        if(key.startsWith("gsx$")) {
              formattedRow[key.replace("gsx$", "")] = row[key].$t
        }
      }
      formattedData.push(formattedRow)
    }
    return formattedData;

    // refactor so formatData is more general
    // console.log(formattedData)
    // formattedData.forEach(addMarker)        
}

function addMarker(data){
    // console.log(data)
    // these are the names of our lat/long fields in the google sheets:
    L.marker([data.lat,data.lng]).addTo(myMap).bindPopup(`<h2>${data.location}</h2>`)
    return data.timestamp
}

let slideshow = document.getElementById("slideimg")
slideshow.src = "http://www.publicartinla.com/Downtown/Little_Tokyo/home_little_tokyo_mural.jpg"

//thanks MDN for providing code alongside documentation, saving me 5 minutes of my life
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

function exploreNew(){
    // need to change: locationStory p tag, slideimg image
    // issue: changing image will mess up spacing. maybe use objectfit property?

    //1) fetch the data return response.json
    //2) format the data, return the array of objects 
    //3) change locationStory and slideimg by passing array into updateContent
    fetch(url)
    .then(response => {
        return response.json()
    })
    .then(data => {
        return formatData(data)
    })
    .then(cleanData => {
        updateContent(cleanData)
    })
}

function updateContent(data){
    let locName = document.getElementById("locationName");
    let image = document.getElementById("slideimg");
    let text = document.getElementById("locationStory");
    
    //1) make sure only stories from entries that gave permission are used. don't show same story
    //BUG: i think there are still some consecutive repeats being shown because locName.innerHTML isn't what I expect sometimes but this seems to mostly work?
    let story = data[getRandomInt(0, data.length)];
    while (story.storypermission == "No" && locName.innerHTML == story.location){
        story = data[getRandomInt(0, data.length)];
    }

    //2) grab elements and update
    locName.innerHTML = story.location;
    if (story.link != ""){
        image.src = story.link;
    }
    else {
        image.src = "images/bliss.jpeg";
    }
    text.innerHTML = '"' + story.favoriteplace + '"';
    // myMap.flyTo([story.lat, story.lng]);
}


//initialize the markers on the map
fetch(url)
.then(response => {
    return response.json()
    })
.then(data =>{
        // console.log(data)
    return formatData(data)
    }
)
.then(cleanData => {
    cleanData.forEach(addMarker)
})

