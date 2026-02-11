// ============================================
// ВЫДВИЖНОЙ ПЛЕЕР
// ============================================

window.BTTFPlayer = window.BTTFPlayer || (function() {
    
    const tracks = [
        { id: 'george', src: 'assets/audio/george.mp3', title: 'George', artist: '', duration: '0:04' },
        { id: 'marty', src: 'assets/audio/marty.mp3', title: 'Marty', artist: '', duration: '0:08' },
        { id: 'doc', src: 'assets/audio/doc.mp3', title: 'Doc', artist: '', duration: '0:15' },
        { id: 'jennifer', src: 'assets/audio/jennifer.mp3', title: "Jennifer", artist: '', duration: '0:37' },
        { id: 'biff', src: 'assets/audio/biff.mp3', title: "Biff", artist: '', duration: '0:06' },
        { id: 'lorraine', src: 'assets/audio/lorraine.mp3', title: "Lorraine", artist: '', duration: '0:05' }
    ];

    let audio = null;
    let currentTrackIndex = 0;
    let isPlaying = false;

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    function initAudio() {
        if (!audio) {
            audio = new Audio();
            audio.volume = 0.7;
        }
        return audio;
    }

    // ===== ЗАГРУЗКА ТРЕКА =====
    function loadTrack(index) {
        if (!audio) initAudio();
        currentTrackIndex = index;
        audio.src = tracks[index].src;
        audio.load();
        updateUI();
    }

    // ===== ВОСПРОИЗВЕДЕНИЕ =====
    function play() {
        if (!audio) initAudio();
        audio.play()
            .then(() => {
                isPlaying = true;
                updateUI();
                expandPlayer(); // РАЗВОРАЧИВАЕМ ПЛЕЕР ПРИ ВОСПРОИЗВЕДЕНИИ
            })
            .catch(e => console.log('Ошибка:', e));
    }

    function pause() {
        if (audio) {
            audio.pause();
            isPlaying = false;
            updateUI();
        }
    }

    function togglePlay() {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }

    // ===== ВОСПРОИЗВЕДЕНИЕ ПО ID =====
    function playTrackById(trackId) {
        const index = tracks.findIndex(t => t.id === trackId);
        if (index !== -1) {
            loadTrack(index);
            play(); // play() сам развернёт плеер
        }
    }

    // ===== УПРАВЛЕНИЕ ПЛЕЕРОМ =====
    function expandPlayer() {
        const player = document.getElementById('collapsiblePlayer');
        if (player) {
            player.classList.remove('collapsed');
            document.body.classList.add('player-expanded-active');
        }
    }

    function collapsePlayer() {
        const player = document.getElementById('collapsiblePlayer');
        if (player) {
            player.classList.add('collapsed');
            document.body.classList.remove('player-expanded-active');
        }
    }

    // ===== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА =====
    function updateUI() {
        // Мини-плеер
        const miniTitle = document.getElementById('miniTrackTitle');
        const miniPlayBtn = document.getElementById('miniPlayPauseBtn');
        
        if (miniTitle) miniTitle.textContent = tracks[currentTrackIndex].title;
        if (miniPlayBtn) miniPlayBtn.innerHTML = isPlaying ? '⏸' : '▶';
        
        // Развёрнутый плеер
        const expandedTitle = document.getElementById('expandedTrackTitle');
        const expandedArtist = document.getElementById('expandedTrackArtist');
        const expandedDuration = document.getElementById('expandedDuration');
        const expandedPlayBtn = document.getElementById('expandedPlayPauseBtn');
        
        if (expandedTitle) expandedTitle.textContent = tracks[currentTrackIndex].title;
        if (expandedArtist) expandedArtist.textContent = tracks[currentTrackIndex].artist;
        if (expandedDuration) expandedDuration.textContent = tracks[currentTrackIndex].duration;
        if (expandedPlayBtn) expandedPlayBtn.innerHTML = isPlaying ? '⏸' : '▶';
    }

    // ===== ПРОГРЕСС =====
    function updateProgress() {
        const seekBar = document.getElementById('expandedSeekBar');
        const currentTimeEl = document.getElementById('expandedCurrentTime');
        
        if (audio && seekBar && currentTimeEl && audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            seekBar.value = progress;
            
            const minutes = Math.floor(audio.currentTime / 60);
            const seconds = Math.floor(audio.currentTime % 60);
            currentTimeEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }

    // ===== ПОДПИСКА НА СОБЫТИЯ =====
    function bindEvents() {
        if (!audio) return;
        audio.addEventListener('timeupdate', updateProgress);
    }

    // ===== ПОДПИСКА НА КНОПКИ =====
    function bindButtons() {
        // Кнопки "Слушать тему"
        document.querySelectorAll('.btn-sound').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                playTrackById(this.dataset.track);
            });
        });
        
        // Кнопки Play/Pause (мини и развёрнутый)
        document.getElementById('miniPlayPauseBtn')?.addEventListener('click', togglePlay);
        document.getElementById('expandedPlayPauseBtn')?.addEventListener('click', togglePlay);
        
        // Кнопки сворачивания/разворачивания
        document.getElementById('expandPlayerBtn')?.addEventListener('click', expandPlayer);
        document.getElementById('collapsePlayerBtn')?.addEventListener('click', collapsePlayer);
        
        // Перемотка
        document.getElementById('expandedSeekBar')?.addEventListener('input', function(e) {
            if (audio && audio.duration) {
                audio.currentTime = (e.target.value / 100) * audio.duration;
            }
        });
        
        // Громкость
        document.getElementById('expandedVolume')?.addEventListener('input', function(e) {
            if (audio) {
                audio.volume = e.target.value;
            }
        });
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    function init() {
        initAudio();
        bindEvents();
        loadTrack(0);
        collapsePlayer(); // По умолчанию свёрнут
        bindButtons();
    }

    return {
        init,
        playTrackById,
        togglePlay,
        expandPlayer,
        collapsePlayer
    };
})();

// ===== СТАРТ =====
document.addEventListener('DOMContentLoaded', () => {
    window.BTTFPlayer.init();
});