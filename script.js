// =====================================================================
// A Sombra de Alice — Core Visual Novel Engine v2.0
// =====================================================================

const DEFAULT_STATE = {
  currentNode: "start",
  hasKey: false,
  sawShadow: false,
  hasDiary: false,
  hasTape: false,
  hasFlashlight: false,
  checkedPortrait: false,
  sawKeyBoard: false,
  hasAtticKey: false,
  sawVictor: false,
  heardVictorTruth: false,
  rejectedVictor: false,
  foundCandles: false,
  foundReports: false,
  sawMirror: false,
  foundAshes: false,
  sawDrawings: false,
  readDiary: false,
  heardTape: false,
  choseTruth: false,
  foundVictorRoom: false,
  sanity: 100,
  historyLog: [],
  unlockedEndings: [],
  clues: []
};

class GameEngine {
  constructor() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.gallery = [];
    this.typewriterInterval = null;
    this.isTyping = false;
    this.currentText = "";
    this.whisperPool = [
      "...ela ainda está aqui...",
      "...você deveria ter ficado...",
      "...por que voltou?...",
      "...ALICE...",
      "...culpa...",
      "...tarde demais...",
      "...ele viu você...",
      "...vance vance vance...",
      "...suba...",
      "...não olhe para trás..."
    ];
    this.whisperInterval = null;
    this.rainAnimFrame = null;
    this.rainDrops = [];

    // Puzzle state
    this.puzzleCorrectPassword = "";
    this.puzzleTargetSuccess = "";
    this.puzzleTargetFail = "";

    // UI Elements
    this.container = document.getElementById("game-container");
    this.bgLayer = document.getElementById("bg-layer");
    this.speakerName = document.getElementById("speaker-name");
    this.dialogText = document.getElementById("dialog-text");
    this.choicesContainer = document.getElementById("choices-container");
    this.flashOverlay = document.getElementById("flash-red-overlay");
    this.staticOverlay = document.querySelector(".static-overlay");
    this.charLeft = document.getElementById("char-left");
    this.charRight = document.getElementById("char-right");
    this.vignetteEl = document.getElementById("vignette");
    this.sceneTransition = document.getElementById("scene-transition");
    this.sceneLocation = document.getElementById("scene-location");
    this.rainCanvas = document.getElementById("rain-canvas");

    // Screens
    this.menuScreen = document.getElementById("menu-screen");
    this.gameScreen = document.getElementById("game-screen");

    // Overlays
    this.historyOverlay = document.getElementById("history-overlay");
    this.galleryOverlay = document.getElementById("gallery-overlay");
    this.settingsOverlay = document.getElementById("settings-overlay");
    this.interactOverlay = document.getElementById("interact-overlay");
    this.notesOverlay = document.getElementById("notes-overlay");

    this.loadGallery();
  }

  init() {
    this.setupEventListeners();
    this.updateVolumeUI();
    this.showScreen("menu-screen");
    this.initRain();
  }

  // ================================================================
  // RAIN SYSTEM
  // ================================================================
  initRain() {
    const canvas = this.rainCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create rain drops
    for (let i = 0; i < 120; i++) {
      this.rainDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 18 + 8,
        speed: Math.random() * 4 + 3,
        opacity: Math.random() * 0.4 + 0.1,
        angle: 0.15
      });
    }

    const animateRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.rainDrops.forEach(drop => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(170, 190, 220, ${drop.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.angle * drop.length, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        drop.x += drop.angle * drop.speed * 0.5;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      this.rainAnimFrame = requestAnimationFrame(animateRain);
    };

    animateRain();
  }

  // ================================================================
  // EVENT LISTENERS
  // ================================================================
  setupEventListeners() {
    // Menu Buttons
    document.getElementById("btn-start").addEventListener("click", () => this.startGame());
    document.getElementById("btn-load-menu").addEventListener("click", () => this.loadSavedGame(true));
    document.getElementById("btn-gallery").addEventListener("click", () => this.openGallery());
    document.getElementById("btn-settings-menu").addEventListener("click", () => this.openSettings());

    // Gameplay Control Buttons
    document.getElementById("btn-save").addEventListener("click", () => this.saveGame());
    document.getElementById("btn-load-game").addEventListener("click", () => this.loadSavedGame(false));
    document.getElementById("btn-history").addEventListener("click", () => this.openHistory());
    document.getElementById("btn-settings-game").addEventListener("click", () => this.openSettings());
    document.getElementById("btn-menu").addEventListener("click", () => this.confirmReturnToMenu());
    document.getElementById("btn-notes").addEventListener("click", () => this.openNotes());
    document.getElementById("btn-notes-panel-close").addEventListener("click", () => this.closeNotes());

    // Overlay Close Buttons
    document.querySelectorAll(".overlay-close").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const overlay = e.target.closest(".overlay-screen");
        if (overlay) overlay.classList.remove("active");
      });
    });

    // Audio Controls
    const volSlider = document.getElementById("volume-slider");
    volSlider.addEventListener("input", (e) => {
      const vol = parseFloat(e.target.value);
      window.gameAudio.setVolume(vol);
      document.getElementById("volume-value").innerText = Math.round(vol * 100) + "%";
    });

    const muteBtn = document.getElementById("btn-mute");
    muteBtn.addEventListener("click", () => {
      const isMuted = window.gameAudio.toggleMute();
      muteBtn.innerText = isMuted ? "Ativar Som" : "Mudar para Mudo";
    });

    // Password Puzzle
    document.getElementById("puzzle-btn-submit").addEventListener("click", () => this.checkPasswordPuzzle());
    document.getElementById("puzzle-btn-cancel").addEventListener("click", () => this.cancelPasswordPuzzle());
    document.getElementById("puzzle-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.checkPasswordPuzzle();
    });

    // Skip dialogue by clicking dialog box
    document.getElementById("dialog-box").addEventListener("click", () => {
      if (this.isTyping) this.skipTypewriter();
    });

    // Notes overlay backdrop click to close
    this.notesOverlay.addEventListener("click", (e) => {
      if (e.target === this.notesOverlay) this.closeNotes();
    });
  }

  // ================================================================
  // GAME START / SCREEN MANAGEMENT
  // ================================================================
  startGame() {
    window.gameAudio.init();
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.showScreen("game-screen");
    this.transitionToNode("start");
  }

  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(scr => scr.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
  }

  // ================================================================
  // SCENE TRANSITION
  // ================================================================
  loadNode(nodeId) {
  // --- FORÇAR ALTURA RESPONSIVA EM MÍDIAS MOBILE ---
  const container = document.getElementById("game-container");
  if (window.innerWidth <= 768) {
    container.style.height = (container.offsetWidth * 0.5625) + "px";
  }
  // ─────────────────────────────────────────────────

  if (nodeId === "main_menu_reset") {
    window.gameAudio.stopBackground();
    // ... restante do seu código original
  transitionToNode(nodeId, instant = false) {
    if (instant) {
      this.loadNode(nodeId);
      return;
    }

    const t = this.sceneTransition;
    t.className = "fade-in";

    setTimeout(() => {
      this.loadNode(nodeId);
      t.className = "fade-out";
      setTimeout(() => { t.className = ""; }, 450);
    }, 400);
  }

  // ================================================================
  // CORE NODE LOADER
  // ================================================================
  loadNode(nodeId) {
    if (nodeId === "main_menu_reset") {
      // Stop ALL audio systems to prevent leakage back to menu
      window.gameAudio.stopBackground();
      window.gameAudio.stopHeartbeat();
      window.gameAudio.stopTapeNoise();
      window.gameAudio.updateSanityFilter(100);
      this.stopWhispers();
      this.showScreen("menu-screen");
      return;
    }

    const node = STORY[nodeId];
    if (!node) {
      console.error(`Story node not found: ${nodeId}`);
      return;
    }

    this.state.currentNode = nodeId;

    // Trigger state mutations
    if (node.onEnter) {
      if (!this.state.unlockedEndings) this.state.unlockedEndings = [];
      node.onEnter(this.state);

      // Save endings permanently
      this.state.unlockedEndings.forEach(end => {
        if (!this.gallery.includes(end)) {
          this.gallery.push(end);
          this.saveGallery();
        }
      });
    }

    // Collect clue if node has one
    if (node.clue) {
      this.collectClue(node.clue);
    }

    // Intercept if this is a puzzle node
    if (node.puzzle) {
      this.showPasswordPuzzle(node.puzzle.password, node.puzzle.success, node.puzzle.fail, node.puzzle.hint);
      return;
    }

    // Clean visual state
    this.container.className = "";
    this.bgLayer.className = "";
    this.flashOverlay.classList.remove("flash-red");
    this.staticOverlay.classList.remove("show-static");

    // Background
    if (node.background) {
      this.bgLayer.classList.add(node.background);
    }

    // Effects
    if (node.effect) {
      switch(node.effect) {
        case "glitch":
          this.bgLayer.classList.add("glitch");
          this.staticOverlay.classList.add("show-static");
          break;
        case "glitch-heavy":
          this.container.classList.add("glitch-heavy");
          this.staticOverlay.classList.add("show-static");
          break;
        case "shake":
          this.container.classList.add("shake");
          break;
        case "shake-heavy":
          this.container.classList.add("shake-heavy");
          break;
        case "flash-red":
          this.flashOverlay.classList.add("flash-red");
          break;
      }
    }

    // Low sanity persistent visuals
    const sanityVal = this.state.sanity ?? 100;
    const dialogBox = document.getElementById("dialog-box");

    if (sanityVal < 40 && nodeId !== "start" && !nodeId.startsWith("ending_")) {
      this.container.classList.add("shake");
      this.bgLayer.classList.add("glitch");
      this.staticOverlay.classList.add("show-static");
      dialogBox.classList.add("bloodied");
      this.startWhispers();
    } else {
      dialogBox.classList.remove("bloodied");
      if (sanityVal >= 40) this.stopWhispers();
    }

    // Update dynamic vignette based on sanity
    this.updateVignette(sanityVal);

    // Location label
    if (node.location !== undefined && this.sceneLocation) {
      this.sceneLocation.innerText = node.location || "Casarão Vance";
    }

    // HUD
    this.renderStats();

    // Autosave
    this.autosaveGame();

    // Character Portraits
    this.renderCharacters(node);

    // Audio
    if (node.audio) {
      if (["drone_creepy","drone_tense","drone_horror_climax","ambient_peaceful","silence"].includes(node.audio)) {
        window.gameAudio.playBackground(node.audio);
      } else {
        window.gameAudio.playSfx(node.audio);
      }
    }

    // Speaker Name
    if (node.speaker && node.speaker !== "Narrador") {
      this.speakerName.innerText = node.speaker;
      this.speakerName.style.display = "block";
    } else {
      this.speakerName.style.display = "none";
    }

    // Log to backlog
    if (nodeId !== "start") {
      this.state.historyLog.push({
        speaker: node.speaker || "Narrador",
        text: node.text
      });
    }

    // Typewriter
    const typingSpeed = node.textSpeed !== undefined ? node.textSpeed : 25;
    this.startTypewriter(node.text, typingSpeed, () => {
      this.renderChoices(node.choices);
    });
  }

  // ================================================================
  // CHARACTER PORTRAITS
  // ================================================================
  renderCharacters(node) {
    if (node.character) {
      const leftSrc = node.character.left ? node.character.left + ".png" : "";
      const rightSrc = node.character.right ? node.character.right + ".png" : "";

      if (leftSrc) {
        this.charLeft.src = leftSrc;
        this.charLeft.classList.add("active");
      } else {
        this.charLeft.classList.remove("active");
        this.charLeft.src = "";
      }

      if (rightSrc) {
        this.charRight.src = rightSrc;
        this.charRight.classList.add("active");
      } else {
        this.charRight.classList.remove("active");
        this.charRight.src = "";
      }

      this.charLeft.classList.remove("focus", "dim", "speak-horror");
      this.charRight.classList.remove("focus", "dim", "speak-horror");

      const getClass = (charName) => charName === "entity" ? "speak-horror" : "focus";

      switch(node.character.focus) {
        case "left":
          this.charLeft.classList.add(getClass(node.character.left));
          if (node.character.right) this.charRight.classList.add("dim");
          break;
        case "right":
          this.charRight.classList.add(getClass(node.character.right));
          if (node.character.left) this.charLeft.classList.add("dim");
          break;
        case "both":
          this.charLeft.classList.add(getClass(node.character.left));
          this.charRight.classList.add(getClass(node.character.right));
          break;
        case "none":
          this.charLeft.classList.add("dim");
          this.charRight.classList.add("dim");
          break;
      }
    } else {
      this.charLeft.classList.remove("active","focus","dim","speak-horror");
      this.charRight.classList.remove("active","focus","dim","speak-horror");
      this.charLeft.src = "";
      this.charRight.src = "";
    }
  }

  // ================================================================
  // TYPEWRITER
  // ================================================================
  startTypewriter(text, speed, onComplete) {
    this.currentText = text;
    this.isTyping = true;
    this.dialogText.innerHTML = "";
    this.choicesContainer.innerHTML = "";

    let index = 0;
    clearInterval(this.typewriterInterval);

    this.typewriterInterval = setInterval(() => {
      if (index < text.length) {
        this.dialogText.innerHTML += text.charAt(index);
        index++;
      } else {
        this.finishTypewriter(onComplete);
      }
    }, speed);
  }

  skipTypewriter() {
    clearInterval(this.typewriterInterval);
    this.dialogText.innerHTML = this.currentText;
    this.finishTypewriter();
  }

  finishTypewriter(onComplete) {
    this.isTyping = false;
    clearInterval(this.typewriterInterval);
    this.dialogText.innerHTML += '<span class="typewriter-cursor"></span>';

    if (onComplete) {
      onComplete();
    } else {
      const node = STORY[this.state.currentNode];
      if (node) this.renderChoices(node.choices);
    }
  }

  // ================================================================
  // RENDER CHOICES
  // ================================================================
  renderChoices(choices) {
    this.choicesContainer.innerHTML = "";
    if (!choices || choices.length === 0) return;

    const sanityVal = this.state.sanity ?? 100;

    // Pool de pensamentos intrusivos para o easter egg de insanidade
    const intrusiveThoughts = [
      "VOCÊ VAI MORRER AQUI",
      "ela está atrás de você",
      "NÃO VIRE",
      "isso não é real",
      "FUJA ENQUANTO PODE",
      "você matou ela",
      "..não saia daqui..",
      "OLHE PARA CIMA",
      "ela nunca foi embora",
      "você é culpada",
    ];

    choices.forEach((choice, index) => {
      if (choice.condition && !choice.condition(this.state)) return;

      const btn = document.createElement("button");
      btn.className = "choice-btn";

      // ── EASTER EGG DE INSANIDADE ──────────────────────────────────
      // Abaixo de 30% de sanidade, cada botão tem 30% de chance de
      // exibir um pensamento intrusivo. O alvo da navegação permanece
      // correto — é só a aparência do texto que corrompe.
      const isCorrupted = sanityVal < 30 && Math.random() < 0.3;
      if (isCorrupted) {
        const thought = intrusiveThoughts[Math.floor(Math.random() * intrusiveThoughts.length)];
        btn.innerText = thought;
        btn.classList.add("choice-btn--corrupted");
      } else {
        btn.innerText = choice.text;
      }
      // ─────────────────────────────────────────────────────────────

      btn.style.animationDelay = `${index * 0.12}s`;

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.transitionToNode(choice.target);
      });

      this.choicesContainer.appendChild(btn);
    });
  }

  // ================================================================
  // STATS HUD (SANITY + INVENTORY)
  // ================================================================
  renderStats() {
    const sanityVal = this.state.sanity ?? 100;
    const sanityFill = document.getElementById("sanity-bar-fill");
    const sanityText = document.getElementById("sanity-value");

    if (sanityFill) {
      sanityFill.style.width = `${sanityVal}%`;
      // Color shift: green->yellow->red based on sanity
      if (sanityVal > 60) {
        sanityFill.style.background = "linear-gradient(90deg, #500000, #aa1111, #dd3333)";
      } else if (sanityVal > 30) {
        sanityFill.style.background = "linear-gradient(90deg, #5a0000, #cc0000, #ff2020)";
      } else {
        sanityFill.style.background = "linear-gradient(90deg, #8b0000, #dd0000, #ff0000)";
        sanityFill.style.animation = "sanityPanic 0.5s ease-in-out infinite alternate";
      }
    }
    if (sanityText) sanityText.innerText = `${sanityVal}%`;

    window.gameAudio.updateSanityFilter(sanityVal);

    // Inventory
    const itemsContainer = document.getElementById("inventory-items");
    if (itemsContainer) {
      const prevItems = new Set([...itemsContainer.querySelectorAll(".inventory-item")].map(el => el.dataset.key));
      itemsContainer.innerHTML = "";

      const items = [
        { key: "hasKey", label: "🔑 Chave" },
        { key: "hasFlashlight", label: "🔦 Lanterna" },
        { key: "hasDiary", label: "📖 Diário" },
        { key: "hasTape", label: "📼 Fita" },
        { key: "hasAtticKey", label: "🗝️ Sótão" }
      ];

      items.forEach(item => {
        if (this.state[item.key]) {
          const el = document.createElement("div");
          el.className = "inventory-item";
          el.dataset.key = item.key;
          el.innerText = item.label;
          // Only animate pop on first appearance
          if (!prevItems.has(item.key)) {
            el.style.animation = "itemPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
          }
          itemsContainer.appendChild(el);
        }
      });
    }
  }

  // ================================================================
  // DYNAMIC VIGNETTE
  // ================================================================
  updateVignette(sanity) {
    if (!this.vignetteEl) return;
    // Lower sanity = more vignette (narrower view)
    const strength = sanity > 60 ? 75 : sanity > 30 ? 83 : 90;
    const opacity = sanity > 60 ? 0.88 : sanity > 30 ? 0.92 : 0.96;
    this.vignetteEl.style.background = `radial-gradient(ellipse at center, transparent 15%, rgba(0, 0, 0, ${opacity}) ${strength}%)`;
  }

  // ================================================================
  // WHISPERS (LOW SANITY)
  // ================================================================
  startWhispers() {
    if (this.whisperInterval) return;
    this.whisperInterval = setInterval(() => this.spawnWhisper(), 3500);
  }

  stopWhispers() {
    clearInterval(this.whisperInterval);
    this.whisperInterval = null;
    // Remove existing whispers
    document.querySelectorAll(".whisper-text").forEach(el => el.remove());
  }

  spawnWhisper() {
    if (!document.getElementById("game-screen").classList.contains("active")) return;
    const text = this.whisperPool[Math.floor(Math.random() * this.whisperPool.length)];
    const el = document.createElement("div");
    el.className = "whisper-text";
    el.innerText = text;
    el.style.left = Math.random() * 70 + 10 + "%";
    el.style.top = Math.random() * 50 + 15 + "%";
    el.style.fontSize = (Math.random() * 0.8 + 0.9) + "rem";
    el.style.zIndex = "7";
    this.container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  // ================================================================
  // CLUE COLLECTION (NOTES / DIARY)
  // ================================================================
  collectClue(clue) {
    if (!this.state.clues) this.state.clues = [];
    const alreadyHas = this.state.clues.some(c => c.title === clue.title);
    if (!alreadyHas) {
      this.state.clues.push(clue);
    }
  }

  // ================================================================
  // NOTES PANEL
  // ================================================================
  openNotes() {
    const cluesList = document.getElementById("notes-clues-list");
    cluesList.innerHTML = "";

    if (!this.state.clues || this.state.clues.length === 0) {
      cluesList.innerHTML = '<p class="notes-empty">Nenhuma pista encontrada ainda.<br><em>Explore o casarão...</em></p>';
    } else {
      this.state.clues.forEach(clue => {
        const entry = document.createElement("div");
        entry.className = "note-entry";
        entry.innerHTML = `
          <div class="note-entry-title">${clue.title}</div>
          <div class="note-entry-text">${clue.text}</div>
        `;
        cluesList.appendChild(entry);
      });
    }

    this.notesOverlay.classList.add("active");
  }

  closeNotes() {
    this.notesOverlay.classList.remove("active");
  }

  // ================================================================
  // PASSWORD PUZZLE
  // ================================================================
  showPasswordPuzzle(correctPassword, targetSuccess, targetFail, hint) {
    this.puzzleCorrectPassword = correctPassword;
    this.puzzleTargetSuccess = targetSuccess;
    this.puzzleTargetFail = targetFail;

    const input = document.getElementById("puzzle-input");
    const desc = document.getElementById("puzzle-description");
    input.value = "";

    if (hint) {
      desc.innerText = hint;
    } else {
      desc.innerText = "Insira a senha de 4 dígitos.";
    }

    this.interactOverlay.classList.add("active");
    setTimeout(() => input.focus(), 100);
  }

  checkPasswordPuzzle() {
    const input = document.getElementById("puzzle-input");

    if (input.value === this.puzzleCorrectPassword) {
      this.interactOverlay.classList.remove("active");
      this.transitionToNode(this.puzzleTargetSuccess);
    } else {
      // Wrong — shake the box
      const box = document.querySelector(".password-box");
      box.style.animation = "none";
      setTimeout(() => {
        box.style.animation = "shakeAnimation 0.4s ease";
        setTimeout(() => { box.style.animation = ""; }, 500);
      }, 10);
      input.value = "";
      input.placeholder = "Errado...";
      setTimeout(() => { input.placeholder = "0000"; }, 1200);
      this.state.sanity = Math.max(0, this.state.sanity - 5);
      this.renderStats();
    }
  }

  cancelPasswordPuzzle() {
    this.interactOverlay.classList.remove("active");
    this.transitionToNode(this.puzzleTargetFail);
  }

  // ================================================================
  // BACKLOG HISTORY
  // ================================================================
  openHistory() {
    const list = document.getElementById("history-list");
    list.innerHTML = "";

    if (this.state.historyLog.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); font-style: italic; font-family: var(--font-serif);">O histórico está vazio.</p>';
    } else {
      this.state.historyLog.forEach(entry => {
        const item = document.createElement("div");
        item.className = "history-entry";
        item.innerHTML = `
          <div class="history-speaker">${entry.speaker}</div>
          <div class="history-text">${entry.text}</div>
        `;
        list.appendChild(item);
      });
    }

    this.historyOverlay.classList.add("active");
    setTimeout(() => {
      const scrollable = this.historyOverlay.querySelector(".scrollable-area");
      scrollable.scrollTop = scrollable.scrollHeight;
    }, 50);
  }

  // ================================================================
  // GALLERY
  // ================================================================
  openGallery() {
    const grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";

    const endingCards = [
      {
        id: "ending_good",
        title: "A Luz do Amanhecer",
        desc: "Redimiu os erros do passado e libertou Alice da maldição através do amor e do perdão.",
        icon: "🌅"
      },
      {
        id: "ending_truth",
        title: "A Verdade que Liberta",
        desc: "Enfrentou a entidade com a verdade nua e aceitou sua culpa sem fugir. O caminho mais difícil e mais honesto.",
        icon: "🕯️"
      },
      {
        id: "ending_consumed",
        title: "O Sacrifício das Sombras",
        desc: "Tentou fugir do porão, foi consumida pela culpa. A entidade tomou seu corpo.",
        icon: "🩸"
      },
      {
        id: "ending_lost",
        title: "Engolida pelo Silêncio",
        desc: "Desceu ao porão sem iluminação e foi arrastada para sempre nas sombras.",
        icon: "🌑"
      },
      {
        id: "ending_coward",
        title: "Fuga Solitária",
        desc: "Fugiu da casa abandonando Alice, mas as assombrações a seguiram para fora.",
        icon: "🚗"
      }
    ];

    endingCards.forEach(card => {
      const isUnlocked = this.gallery.includes(card.id);
      const div = document.createElement("div");
      div.className = `gallery-card ${isUnlocked ? "unlocked" : ""}`;
      div.innerHTML = `
        <div class="ending-status">${isUnlocked ? "✓ Desbloqueado" : "🔒 Bloqueado"}</div>
        <div class="ending-title">${isUnlocked ? card.icon + " " + card.title : "???"}</div>
        <div class="ending-desc">${isUnlocked ? card.desc : "Complete os mistérios do casarão Vance para revelar este final."}</div>
      `;
      grid.appendChild(div);
    });

    this.galleryOverlay.classList.add("active");
  }

  openSettings() {
    this.settingsOverlay.classList.add("active");
  }

  updateVolumeUI() {
    const vol = parseFloat(window.gameAudio.volume);
    document.getElementById("volume-slider").value = vol;
    document.getElementById("volume-value").innerText = Math.round(vol * 100) + "%";
  }

  // ================================================================
  // SAVE / LOAD / AUTOSAVE
  // ================================================================
  saveGame() {
    try {
      const save = this._buildSaveState();
      localStorage.setItem("sombra_alice_save", JSON.stringify(save));

      // Brief visual feedback
      const btn = document.getElementById("btn-save");
      const orig = btn.innerText;
      btn.innerText = "✓ Salvo!";
      btn.style.color = "#4caf50";
      setTimeout(() => { btn.innerText = orig; btn.style.color = ""; }, 1500);
    } catch (e) {
      console.error("Failed to save", e);
      alert("Erro ao salvar o jogo.");
    }
  }

  autosaveGame() {
    if (this.state.currentNode === "start" || this.state.currentNode.startsWith("ending_")) return;
    try {
      localStorage.setItem("sombra_alice_save", JSON.stringify(this._buildSaveState()));
      console.log("Autosave:", this.state.currentNode);
    } catch (e) {
      console.error("Autosave failed", e);
    }
  }

  _buildSaveState() {
    return {
      currentNode: this.state.currentNode,
      hasKey: this.state.hasKey,
      sawShadow: this.state.sawShadow,
      hasDiary: this.state.hasDiary,
      hasTape: this.state.hasTape,
      hasFlashlight: this.state.hasFlashlight,
      checkedPortrait: this.state.checkedPortrait,
      sawKeyBoard: this.state.sawKeyBoard,
      hasAtticKey: this.state.hasAtticKey,
      sawVictor: this.state.sawVictor,
      heardVictorTruth: this.state.heardVictorTruth,
      rejectedVictor: this.state.rejectedVictor,
      foundCandles: this.state.foundCandles,
      foundReports: this.state.foundReports,
      sawMirror: this.state.sawMirror,
      foundAshes: this.state.foundAshes,
      sawDrawings: this.state.sawDrawings,
      readDiary: this.state.readDiary,
      heardTape: this.state.heardTape,
      choseTruth: this.state.choseTruth,
      foundVictorRoom: this.state.foundVictorRoom,
      sanity: this.state.sanity,
      historyLog: this.state.historyLog,
      unlockedEndings: this.state.unlockedEndings,
      clues: this.state.clues || []
    };
  }

  loadSavedGame(fromMainMenu = false) {
    try {
      const saved = localStorage.getItem("sombra_alice_save");
      if (!saved) {
        alert("Nenhum arquivo de save encontrado!");
        return;
      }

      const parsed = JSON.parse(saved);
      // Merge with defaults to handle missing fields from old saves
      this.state = { ...JSON.parse(JSON.stringify(DEFAULT_STATE)), ...parsed };

      window.gameAudio.init();

      if (fromMainMenu) {
        this.showScreen("game-screen");
      } else {
        this.settingsOverlay.classList.remove("active");
      }

      this.transitionToNode(this.state.currentNode, true);
    } catch (e) {
      console.error("Failed to load saved state", e);
      alert("Erro ao carregar o save.");
    }
  }

  confirmReturnToMenu() {
    if (confirm("Deseja mesmo retornar ao menu? Progresso não salvo será perdido.")) {
      window.gameAudio.stopBackground();
      window.gameAudio.updateSanityFilter(100);
      this.stopWhispers();
      this.showScreen("menu-screen");
    }
  }

  // ================================================================
  // GALLERY STORAGE
  // ================================================================
  loadGallery() {
    try {
      const savedGallery = localStorage.getItem("sombra_alice_gallery");
      this.gallery = savedGallery ? JSON.parse(savedGallery) : [];
    } catch (e) {
      this.gallery = [];
    }
  }

  saveGallery() {
    try {
      localStorage.setItem("sombra_alice_gallery", JSON.stringify(this.gallery));
    } catch (e) {
      console.error("Failed to save gallery", e);
    }
  }
}

// Instantiate and start
document.addEventListener("DOMContentLoaded", () => {
  window.gameAudio = window.gameAudio || { 
    init: ()=>{}, playBackground: ()=>{}, playSfx: ()=>{}, 
    stopBackground: ()=>{}, setVolume: ()=>{}, toggleMute: ()=>false,
    updateSanityFilter: ()=>{}, volume: 0.5
  };
  window.gameEngine = new GameEngine();
  window.gameEngine.init();
});
