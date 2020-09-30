const city = document.getElementById('city');
const btn = document.getElementById('btn');
const cloud = document.getElementById('city');
const temp = document.getElementById('city');
const pressure = document.getElementById('city');
const humidity = document.getElementById('city');
const windspeed = document.getElementById('city');

btn.addEventListener('click', () => {
    let cityName = city.value;
    let appId = 'd90eae9f9ee313a6fbfc12712b4104ea';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appId}`
    getData(url);
});


const xhr = new XMLHttpRequest;
xhr.addEventListener('readystatechange', function () {
if (xhr.readyState === 4) {
    if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);     
    } else {
        console.log(xhr.statusText);
    }
}

});


xhr.open('get','http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + appId);
xhr.send();

