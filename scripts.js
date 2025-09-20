// DOM elements
const fileInput = document.getElementById('fileInput');
const albumArt = document.getElementById('album-art');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

// State
let songs = [];
let songIndex = 0;
let isPlaying = false;

// Load a song
const loadSong = (song) => {
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist || "Unknown";
    albumArt.src = song.imageSrc || 'https://placehold.co/500x500/000000/FFFFFF?text=Album+Art';
    audio.src = song.audioSrc;
};

// Play / Pause
const playSong = () => {
    isPlaying = true;
    audio.play();
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
};
const pauseSong = () => {
    isPlaying = false;
    audio.pause();
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
};

// Next / Previous
const nextSong = () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
};
const prevSong = () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
};

// Update progress
const updateProgress = () => {
    const { duration, currentTime } = audio;
    if (!duration) return;
    const percent = (currentTime / duration) * 100;
    progressBar.style.width = percent + '%';

    const min = Math.floor(currentTime / 60);
    const sec = Math.floor(currentTime % 60).toString().padStart(2, '0');
    currentTimeEl.textContent = `${min}:${sec}`;

    const tMin = Math.floor(duration / 60);
    const tSec = Math.floor(duration % 60).toString().padStart(2, '0');
    totalTimeEl.textContent = `${tMin}:${tSec}`;
};

// Set progress by click
const setProgress = (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
};

// Event listeners
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgress);

// File input
fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files);
    if (!files.length) return;

    songs = files.map(file => ({
        title: file.name,
        artist: "Unknown",
        audioSrc: URL.createObjectURL(file),
        imageSrc: 'https://placehold.co/500x500/000000/FFFFFF?text=Local+Song'
    }));

    songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
});
