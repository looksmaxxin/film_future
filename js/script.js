// ===== АУДИОПЛЕЕР =====
class BackToFuturePlayer {
    constructor() {
        this.audio = new Audio();
        this.audio.volume = 0.7;
        
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        
        // Треки из фильма
        this.tracks = [
            { src: 'assets/audio/power-of-love.mp3', title: 'The Power of Love', artist: 'Huey Lewis & The News', duration: '4:52' },
            { src: 'assets/audio/back-in-time.mp3', title: 'Back in Time', artist: 'Huey Lewis & The News', duration: '4:22' },
            { src: 'assets/audio/theme.mp3', title: 'Back to the Future Theme', artist: 'Alan Silvestri', duration: '3:21' },
            { src: 'assets/audio/johnny-b-goode.mp3', title: 'Johnny B. Goode', artist: 'Chuck Berry / Marty McFly', duration: '3:08' },
            { src: 'assets/audio/earth-angel.mp3', title: 'Earth Angel', artist: 'Marvin Berry & The Starlighters', duration: '3:02' },
            { src: 'assets/audio/mr-sandman.mp3', title: 'Mr. Sandman', artist: 'The Four Aces', duration: '2:38' },
            { src: 'assets/audio/end-credits.mp3', title: 'End Credits', artist: 'Alan Silvestri', duration: '8:32' }
        ];
        
        this.init();
    }
    
    init() {
        // Элементы плеера
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.seekBar = document.getElementById('seekBar');
        this.volumeControl = document.getElementById('volumeControl');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('durationTime');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        this.playlistItems = document.querySelectorAll('#playlist li');
        this.initSearch();
        
        if (!this.playPauseBtn) return; // Не на странице плеера
        
        // Загрузка первого трека
        this.loadTrack(this.currentTrackIndex);
        
        // События
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.setDuration());
        this.audio.addEventListener('ended', () => this.nextTrack());
        
        this.seekBar.addEventListener('input', () => this.seek());
        this.volumeControl?.addEventListener('input', () => {
            this.audio.volume = this.volumeControl.value;
        });
        
        // Клик по плейлисту
        this.playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(this.currentTrackIndex);
                this.play();
            });
        });
        
        // Кнопки "Слушать" на страницах
        document.querySelectorAll('.btn-sound, .btn-atmosphere').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = e.currentTarget.dataset.track;
                let trackIndex = 0;
                
                // Соответствие треков
                if (trackId === 'power-of-love' || trackId === 'johnny-b-goode') trackIndex = 3;
                else if (trackId === 'theme' || trackId === 'doc-theme') trackIndex = 2;
                else if (trackId === 'back-in-time') trackIndex = 1;
                else if (trackId === 'earth-angel') trackIndex = 4;
                else if (trackId === 'mr-sandman') trackIndex = 5;
                else if (trackId === 'end-credits' || trackId === 'clocktower') trackIndex = 6;
                else trackIndex = 0;
                
                this.currentTrackIndex = trackIndex;
                this.loadTrack(this.currentTrackIndex);
                this.play();
                
                // Переход на страницу плеера, если не там
                if (!window.location.pathname.includes('locations')) {
                    window.location.href = 'locations.html';
                }
            });
        });
    }
    
    loadTrack(index) {
        this.audio.src = this.tracks[index].src;
        this.audio.load();
        
        if (this.trackTitle) {
            this.trackTitle.textContent = this.tracks[index].title;
            this.trackArtist.textContent = this.tracks[index].artist;
        }
        
        // Активный трек в плейлисте
        if (this.playlistItems) {
            this.playlistItems.forEach(item => item.classList.remove('active'));
            if (this.playlistItems[index]) {
                this.playlistItems[index].classList.add('active');
            }
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
        if (this.playPauseBtn) {
            this.playPauseBtn.innerHTML = '⏸';
            this.playPauseBtn.classList.add('playing');
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        if (this.playPauseBtn) {
            this.playPauseBtn.innerHTML = '▶';
            this.playPauseBtn.classList.remove('playing');
        }
    }
    
    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
        this.play();
    }
    
    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.loadTrack(this.currentTrackIndex);
        this.play();
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.seekBar.value = percent;
            
            const minutes = Math.floor(this.audio.currentTime / 60);
            const seconds = Math.floor(this.audio.currentTime % 60);
            this.currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }
    
    setDuration() {
        const minutes = Math.floor(this.audio.duration / 60);
        const seconds = Math.floor(this.audio.duration % 60);
        this.durationEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    seek() {
        const seekTo = (this.seekBar.value / 100) * this.audio.duration;
        this.audio.currentTime = seekTo;
    }
    // ===== ПОИСК ПО ТРЕКАМ =====
    initSearch() {
        const searchInput = document.getElementById('trackSearch');
        if (!searchInput) return;

        searchInput.addEventListener('keyup', () => {
            const query = searchInput.value.toLowerCase().trim();
            const items = document.querySelectorAll('#playlist li');
            
            items.forEach((item, index) => {
                const title = this.tracks[index].title.toLowerCase();
                const artist = this.tracks[index].artist.toLowerCase();
            
                if (title.includes(query) || artist.includes(query) || query === '') {
                    item.style.display = 'flex'; // показываем
                } else {
                    item.style.display = 'none';  // скрываем
                }
            });
        });
    }
}

// ===== АКТИВНОЕ МЕНЮ =====
function setActiveNav() {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (path.includes('index') || path.endsWith('/')) {
            if (link.getAttribute('href') === 'index.html') link.classList.add('active');
        } else if (path.includes('characters')) {
            if (link.getAttribute('href') === 'characters.html') link.classList.add('active');
        } else if (path.includes('locations')) {
            if (link.getAttribute('href') === 'locations.html') link.classList.add('active');
        }
    });
}

// ===== ЗАПУСК =====
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    const player = new BackToFuturePlayer();
});