const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

// Función para reproducir música
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// Función para pausar música
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// Función para la canción anterior
function prevMusic(){
  musicIndex--; // decrementar musicIndex en 1
  // si musicIndex es menor que 1, entonces musicIndex será la longitud del array para reproducir la última canción
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// Función para la siguiente canción
function nextMusic(){
  musicIndex++; // incrementar musicIndex en 1
  // si musicIndex es mayor que la longitud del array, entonces musicIndex será 1 para reproducir la primera canción
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// Evento del botón reproducir/pausar
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  // si isPlayMusic es verdadero, llama a la función pauseMusic; de lo contrario, llama a playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

// Evento del botón de canción anterior
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

// Evento del botón de siguiente canción
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// Actualiza el ancho de la barra de progreso según el tiempo actual de la música
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime; // obteniendo el tiempo actual de la canción
  const duration = e.target.duration; // obteniendo la duración total de la canción
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", ()=>{
    // actualiza la duración total de la canción
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if(totalSec < 10){ // si los segundos son menores que 10, agrega un 0 antes
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // actualiza el tiempo actual de reproducción de la canción
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){ // si los segundos son menores que 10, agrega un 0 antes
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Actualiza el tiempo actual de reproducción de la canción según el ancho de la barra de progreso
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; // obteniendo el ancho de la barra de progreso
  let clickedOffsetX = e.offsetX; // obteniendo el valor del desplazamiento X
  let songDuration = mainAudio.duration; // obteniendo la duración total de la canción
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); // llama a la función playMusic
  playingSong();
});

// Cambia el ícono de repetición, shuffle y repeat al hacer clic
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; // obteniendo el texto interno de esta etiqueta
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Canción en bucle");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Reproducción aleatoria");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Lista de reproducción en bucle");
      break;
  }
});

// Código para lo que hacer después de que termine la canción
mainAudio.addEventListener("ended", ()=>{
  // haremos según el ícono; si el usuario ha establecido el ícono para
  // repetir la canción, repetiremos la canción actual y haremos lo correspondiente
  let getText = repeatBtn.innerText; // obteniendo el texto interno de esta etiqueta
  switch(getText){
    case "repeat":
      nextMusic(); // llama a la función nextMusic
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; // establece el tiempo actual del audio en 0
      loadMusic(musicIndex); // llama a la función loadMusic con el índice actual de la canción
      playMusic(); // llama a la función playMusic
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); // genera un índice/num al azar dentro del rango máximo de la longitud del array
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); // este bucle se ejecuta hasta que el próximo número aleatorio no sea igual al musicIndex actual
      musicIndex = randIndex; // pasa randIndex a musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

// Mostrar la lista de música al hacer clic en el ícono de música
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// crear etiquetas li según la longitud del array para la lista
for (let i = 0; i < allMusic.length; i++) {
  // pasemos el nombre de la canción y el artista desde el array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); // insertar el li dentro de la etiqueta ul

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ // si los segundos son menores que 10, agrega un 0 antes
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; // pasando la duración total de la canción
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); // agregando el atributo t-duration con el valor de la duración total
  });
}

// reproducir canción específica de la lista al hacer clic en la etiqueta li
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // si el índice de la etiqueta li es igual al musicIndex, agrega la clase playing
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Reproduciendo";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

// función de clic en la etiqueta li particular
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; // actualiza el índice de la canción actual con el índice de la li clicada
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}
