// [ ACOUSTIC_RESONANCE_SYSTEM_V2.3 - RANDOMIZED ]
const playlist = [
    { title: "Bhairav", file: "track1.mp3" },
    { title: "Kalawati", file: "track2.mp3" },
    { title: "Malkauns", file: "track3.mp3" },
    { title: "Yaman", file: "track4.mp3" },
    { title: "Bad Bitch", file: "track5.mp3" },
    { title: "Перепутала", file: "track6.mp3" },
    { title: "Acenda o farol", file: "track7.mp3" },
    { title: "O Descobridor Dos Sete Mares", file: "track8.mp3" },
    { title: "Amores Lejanos", file: "track9.mp3" },
    { title: "Mi Manera de querer", file: "track10.mp3" },
    { title: "Aja mahi", file: "track11.mp3" },
    { title: "خونه ی ما", file: "track12.mp3" },
    { title: "Vienna Calling", file: "track13.mp3" },
    { title: "Ciudad de la furia", file: "track14.mp3" },
    { title: "ВИРТУАЛЬНАЯ ЛЮБОВЬ", file: "track15.mp3" }
    
];

// 1. START WITH RANDOM TRACK
let currentTrackIndex = Math.floor(Math.random() * playlist.length);
let isShuffle = false; // Shuffle state

const audio = new Audio();
audio.volume = 0.5;

const initJukebox = () => {
    const jukeboxHTML = `
    <div id="jukebox-card" style="position: fixed; top: 100px; left: 20px; width: 140px; z-index: 999999; background: rgba(5,5,10,0.98); border: 1px solid var(--warning-orange); border-left: 3px solid var(--warning-orange); padding: 12px; pointer-events: all; cursor: default; box-shadow: 0 0 20px rgba(0,0,0,0.8); user-select: none;">
        
        <div id="jukebox-header" style="color:var(--warning-orange); font-size:0.55rem; font-weight:bold; margin-bottom:10px; display:flex; justify-content:space-between; cursor: move; border-bottom: 1px solid #333; padding-bottom: 5px;">
            <span>[ MY PLAYLIST ]</span>
            <span>☊</span>
        </div>

        <div id="track-info" style="font-size: 0.7rem; margin-bottom: 10px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Fira Code', monospace;">TRACK: IDLE</div>
        
        <div id="progress-container" style="width: 100%; height: 6px; background: #111; margin-bottom: 12px; cursor: pointer; position: relative; border-radius: 2px;">
            <div id="progress-bar" style="width: 0%; height: 100%; background: var(--warning-orange); box-shadow: 0 0 8px var(--warning-orange); border-radius: 2px;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 4px;">
            <button id="prev-btn" class="btn-mini">⟪</button>
            <button id="play-pause" class="btn-mini" style="color: var(--plasma-cyan); border-color: var(--plasma-cyan); font-size: 1rem; flex-grow: 1;">▶</button>
            <button id="next-btn" class="btn-mini">⟫</button>
            <button id="shuffle-btn" class="btn-mini" title="Toggle Shuffle">🔀</button>
        </div>
        
        <input type="range" id="vol-slider" min="0" max="1" step="0.01" value="0.5" 
               style="width: 100%; margin-top: 12px; accent-color: var(--warning-orange); cursor: pointer; height: 3px;">
    </div>

    <style>
        .btn-mini {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--warning-orange);
            color: var(--warning-orange);
            cursor: pointer;
            font-family: 'Fira Code', monospace;
            padding: 4px 6px;
            font-size: 0.75rem;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-mini:hover { background: rgba(255, 174, 0, 0.2); box-shadow: 0 0 8px var(--warning-orange); }
        .btn-mini.active { color: var(--plasma-cyan); border-color: var(--plasma-cyan); box-shadow: 0 0 8px var(--plasma-cyan); }
        #jukebox-card:active { cursor: grabbing; }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', jukeboxHTML);

    const card = document.getElementById('jukebox-card');
    const header = document.getElementById('jukebox-header');
    const progressContainer = document.getElementById('progress-container');
    const playBtn = document.getElementById('play-pause');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const volSlider = document.getElementById('vol-slider');

    const stopBeam = (e) => e.stopPropagation();
    card.addEventListener('pointerdown', stopBeam);
    card.addEventListener('mousedown', stopBeam);
    card.addEventListener('click', stopBeam);

    let isDragging = false, offset = { x: 0, y: 0 };
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset = { x: card.offsetLeft - e.clientX, y: card.offsetTop - e.clientY };
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        card.style.left = (e.clientX + offset.x) + 'px';
        card.style.top = (e.clientY + offset.y) + 'px';
        card.style.bottom = 'auto'; 
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // --- LOGIC FUNCTIONS ---

    const setNextTrack = () => {
        if (isShuffle) {
            // Pick a random track that isn't the current one (if playlist > 1)
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
            currentTrackIndex = newIndex;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        }
    };

    // --- CONTROLS ---

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => console.log("User interaction required"));
            playBtn.innerText = "‖";
        } else {
            audio.pause();
            playBtn.innerText = "▶";
        }
    });

    nextBtn.addEventListener('click', () => {
        setNextTrack();
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerText = "‖";
    });

    prevBtn.addEventListener('click', () => {
        // Prev button usually goes back linearly, but we can make it random if shuffle is on 
        // Logic: Linear back if not shuffle, otherwise random
        if (isShuffle) {
            setNextTrack(); 
        } else {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        }
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerText = "‖";
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = pos * audio.duration;
    });

    volSlider.oninput = (e) => { audio.volume = e.target.value; };
    
    audio.ontimeupdate = () => {
        const pct = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress-bar').style.width = (pct || 0) + "%";
    };
    
    audio.onended = () => {
        setNextTrack();
        loadTrack(currentTrackIndex);
        audio.play();
    };

    function loadTrack(index) {
        const track = playlist[index];
        audio.src = track.file;
        document.getElementById('track-info').innerText = `TRACK: ${track.title}`;
    }

    // Initialize with the random index chosen at top
    loadTrack(currentTrackIndex);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJukebox);
} else {
    initJukebox();
}