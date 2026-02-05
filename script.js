document.addEventListener('DOMContentLoaded', () => {
    console.log('海克斯台球: 页面加载完成');

    // DOM Elements
    const mainMenu = document.getElementById('main-menu');
    const slotMachine = document.getElementById('slot-machine');
    const tierSelection = document.getElementById('tier-selection');
    const cardDisplay = document.getElementById('card-display');
    const resultDisplay = document.getElementById('result-display');
    const cardsContainer = document.getElementById('cards-container');
    const selectedCardContainer = document.getElementById('selected-card');
    const slotResultText = document.getElementById('slot-result-text');
    const selectedHexPanel = document.getElementById('selected-hex-panel');
    const selectedHexList = document.getElementById('selected-hex-list');
    const selectedCountSpan = document.getElementById('selected-count');
    const clearSelectionBtn = document.getElementById('clear-selection-btn');

    // Buttons
    const citySelectBtn = document.getElementById('city-select-btn');
    const directStartBtn = document.getElementById('direct-start-btn');
    const spinBtn = document.getElementById('spin-btn');
    const respinBtn = document.getElementById('respin-btn');
    const slotBackBtn = document.getElementById('slot-back-btn');
    const tierBackBtn = document.getElementById('tier-back-btn');
    const backBtn = document.getElementById('back-btn');
    const newGameBtn = document.getElementById('new-game-btn');

    // 检查关键元素
    if (!citySelectBtn || !directStartBtn) {
        console.error('错误: 未找到主菜单按钮');
        return;
    }
    console.log('海克斯台球: 所有按钮已找到');

    // State
    let isSpinning = false;
    let selectedHexCards = []; // 已选择的海克斯卡片，最多3个
    let roundCounters = [0, 0, 0]; // 回合计数器
    const MAX_SELECTED_HEX = 3;

    // 所有海克斯卡片数据
    const allCards = [
        // 白银阶
        { id: 1, name: "重来一次", description: "本局可以重新击打一次失误的球", tier: "silver" },
        { id: 2, name: "快速思考", description: "选下后对方必须5s内打出，否则算犯规", tier: "silver" },
        { id: 3, name: "自由落位", description: "可以将白球移动到5cm距离内的点一次", tier: "silver" },
        { id: 5, name: "安全网", description: "本局第一次犯规不算", tier: "silver" },
        { id: 6, name: "黑八算你", description: "黑8算作你的球，打进后可继续击球", tier: "silver" },
        { id: 7, name: "利滚利", description: "3个回合后进行判定，若你的场上球比对方少，则你获得1次自由球", tier: "silver" },
        { id: 8, name: "摆烂", description: "3个回合后进行判定，若你的场上球比对方多，则你获得1次自由球", tier: "silver" },
        { id: 9, name: "双倍击球", description: "可以对同一个球连续两次击杆,限1次", tier: "silver" },
        { id: 10, name: "贴库高手", description: "若某次白球最终贴库停住，下一杆获得1次自由球", tier: "silver" },
        { id: 11, name: "小心地雷", description: "指定对手一颗球为地雷，对手白球触碰该球即算犯规（持续2回合）", tier: "silver" },
        { id: 12, name: "铁壁防守", description: "本局击打的白球进袋和黑球提前进袋不算犯规", tier: "silver" },
        { id: 14, name: "边角料", description: "若进的是贴库球，下一杆可获得1次额外击球机会", tier: "silver" },
        { id: 15, name: "弹幕射击", description: "（立刻使用）你的下一杆白球触碰到3颗或以上的球，获得自由球", tier: "silver" },
        { id: 16, name: "禁止专精", description: "本局禁止对方使用专精装和擦杆", tier: "silver" },
        { id: 17, name: "过河拆桥", description: "你的击球回合可以暂时移除对方的一个球，减少干扰，限一次", tier: "silver" },
        { id: 18, name: "事不过三", description: "立刻使用，下一次你击球时，可总共进行3次出杆（无论是否进球都是3次），但必须至少打进一颗球，否则对方获得1次自由球", tier: "silver" },
        { id: 19, name: "桃园结义", description: "每2个回合，若无人进球，则你和对手选择各自1颗球从场上移除", tier: "silver" },
        { id: 20, name: "五谷丰登", description: "你可以重新再刷新1次银色海克斯，本局你和对手海克斯选择提前，立刻改为每共进3球选择一个海克斯，", tier: "silver" },
        // 黄金阶
        { id: 21, name: "搅屎棍", description: "场上若有人打进黑八，则双方交换花色", tier: "gold" },
        { id: 22, name: "窃取", description: "（立刻使用）对手下一颗进的球可算作你的，选择场上的任意一球与其交换位置", tier: "gold" },
        { id: 23, name: "自由落位+", description: "获得1次自由球", tier: "gold" },
        { id: 24, name: "封印角袋", description: "指定一个袋口，对手5回合不能使用，若对手不小心打进，你获得1次自由球", tier: "gold" },
        { id: 25, name: "安全网+", description: "本局的下两次犯规不算", tier: "gold" },
        { id: 26, name: "镜像空间", description: "使用后，对手下2杆必须单手击球", tier: "gold" },
        { id: 27, name: "利滚利+", description: "进行判定：若此刻你的场上球比对方少，则获得1次自由球。3回合后可再判定一次", tier: "gold" },
        { id: 28, name: "摆烂+", description: "进行判定：若此刻你的场上球比对方多，则获得1次自由球。3回合后可再判定一次", tier: "gold" },
        { id: 29, name: "顺手牵羊", description: "选择对手一颗球绑定，本杆若你进球则该球你放在任意位置", tier: "gold" },
        { id: 30, name: "传送门", description: "（随时可用，对手回合也可）将白球与你的任意球交换位置", tier: "gold" },
        { id: 31, name: "接二连三", description: "（全局可用）只要宣布本次回合内你连进2球并成功，此回合你额外获得1次击球", tier: "gold" },
        { id: 32, name: "原始人", description: "对手的下2次击球，必须在白球附近用手滚出（不可高抛或弹跳）", tier: "gold" },
        { id: 33, name: "优柔寡断", description: "（立刻使用）接下来3个回合，你放弃击球，3回合后，获得2次自由球", tier: "gold" },
        { id: 34, name: "火麟飞", description: "对手的下一次击球必须瞄准后闭眼打出", tier: "gold" },
        { id: 35, name: "一板一眼", description: "（开局可选）你场上的球减半，但对手每回合结束后，还可以再击一次球", tier: "gold" },
        
        // 棱彩阶
        { id: 36, name: "过河拆桥max", description: "（立刻使用）将场上对方的一颗球移除，3回合后，该球将被重新放置到黑8的初始位置，你获得1次自由球，在此移除期间对手不可获得胜利", tier: "prismatic" },
        { id: 37, name: "预见未来", description: "每2个回合，对手必须提前告知下回合碰到哪颗球，若没碰到，则你获得1次自由球", tier: "prismatic" },
        { id: 38, name: "片叶不沾身", description: "（全局可用）使用前说明自己本杆挑战“片叶不沾身”，若此球碰到四边库且没有碰到任何球，则获得一次自由球，（此球空杆不算犯规），但若碰到对方球，则对方获得一个任意球", tier: "prismatic" },
        { id: 39, name: "翻袋宣言", description: "本局只要宣布本杆打翻袋成功进球，成功获得2次自由球", tier: "prismatic" },
        { id: 40, name: "双倍封印", description: "指定任意两个不同排但可同列（比如两个中袋为同一排）的袋口，对手本局不能使用", tier: "prismatic" },
        { id: 41, name: "我有黑哨", description: "本局的下5次犯规不算", tier: "prismatic" },
        { id: 42, name: "轨道镭射", description: "每隔3回合，可以选择将摆球三角架放置在球台任意位置，放置持续双方各一杆", tier: "prismatic" },
        { id: 43, name: "利滚利++", description: "每隔4回合，若你的场上球比对方少，则获得1次自由球", tier: "prismatic" },
        { id: 44, name: "摆烂王++", description: "每隔3回合，若你的场上球比对方多，则获得1次自由球", tier: "prismatic" },
        { id: 45, name: "两级反转", description: "（立刻使用）与对方交换击球花色（不包括黑8）", tier: "prismatic" },
        { id: 46, name: "翻盘点", description: "（立刻使用）若此刻对手场上球领先你3颗或以上，你立即获得2次自由球", tier: "prismatic" },
        { id: 47, name: "集合，一波！", description: "当你只剩下最后一颗球时，该球进袋直接获胜，无需打黑8", tier: "prismatic" },
        { id: 48, name: "精准奇才", description: "（全局可用）你打进了距离超过半场的球，则可获得1次自由球", tier: "prismatic" },
        { id: 49, name: "连拨击锤", description: "（全局可用）你击打的白球碰到3颗或以上球时，获得1次自由球", tier: "prismatic" },
        { id: 50, name: "混沌召唤", description: "（立刻使用）将对手的所有场上的球重新聚拢摆放在球台中央", tier: "prismatic" },
        { id: 51, name: "恶魔契约", description: "（仅开局可选）分球后移除你的所有球，只留黑8，但每打不进一次，对方便可移除一颗球并获一球自由", tier: "prismatic" },
        { id: 52, name: "重质不重量", description: "（立刻使用）选择你场上的一颗球变为对手的", tier: "prismatic" },
        { id: 53, name: "遥遥领先", description: "（你的回合可用）放弃击球回合，改为主动移除自己一颗球，对手也移除自己一颗球，可用3次，不可移除你的最后一颗球", tier: "prismatic" }
    ];

    // 阶段限制配置 - 用户可自行修改ID列表
    const stageRestrictions = {
        // 只能在第一阶段选择的海克斯ID
        onlyStage1: [35, 51,20],  // （开局可选）

        // 只能在第三阶段选择的海克斯ID
        onlyStage3: [],

        // 不能在第一阶段选择的海克斯ID
        notStage1: [],

        // 不能在第三阶段选择的海克斯ID
        notStage3: []
    };

    const tierNames = {
        silver: '白银阶',
        gold: '黄金阶',
        prismatic: '棱彩阶'
    };

    // ==================== Event Listeners ====================

    // Main menu
    citySelectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('点击: 城邦选择');
        showSection('slot-machine');
        resetSlotMachine();
    });

    directStartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('点击: 直接开始');
        showSection('tier-selection');
    });

    // Slot machine
    spinBtn.addEventListener('click', startSlotMachine);
    respinBtn.addEventListener('click', () => {
        resetSlotMachine();
        startSlotMachine();
    });
    slotBackBtn.addEventListener('click', () => {
        showSection('main-menu');
    });

    // Tier selection
    tierBackBtn.addEventListener('click', () => {
        showSection('main-menu');
    });

    document.querySelectorAll('.tier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tier = btn.dataset.tier;
            drawCards(tier);
        });
    });

    // Card display
    backBtn.addEventListener('click', () => {
        showSection('tier-selection');
    });

    // Result display
    newGameBtn.addEventListener('click', () => {
        clearSelectedHex();
        showSection('main-menu');
    });

    // Clear selection button
    clearSelectionBtn.addEventListener('click', () => {
        clearSelectedHex();
    });

    // Round counter buttons
    document.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.dataset.index);
            if (btn.classList.contains('plus')) {
                roundCounters[index]++;
            } else if (btn.classList.contains('minus')) {
                roundCounters[index] = Math.max(0, roundCounters[index] - 1);
            } else if (btn.classList.contains('reset')) {
                roundCounters[index] = 0;
            }
            document.getElementById(`counter-${index}`).textContent = roundCounters[index];
        });
    });

    // ==================== Slot Machine Functions ====================

    function getRandomTier() {
        const rand = Math.random();
        // 棱彩 40%, 黄金 35%, 白银 25%
        if (rand < 0.40) return 'prismatic';
        if (rand < 0.75) return 'gold';
        return 'silver';
    }

    function startSlotMachine() {
        if (isSpinning) return;

        isSpinning = true;
        spinBtn.disabled = true;
        spinBtn.classList.add('spinning');
        spinBtn.textContent = '抽取中...';
        respinBtn.classList.add('hidden');
        slotResultText.classList.add('hidden');

        // Generate results
        const results = [getRandomTier(), getRandomTier(), getRandomTier()];

        // Start spinning
        const reels = [
            document.querySelector('#reel1 .reel-inner'),
            document.querySelector('#reel2 .reel-inner'),
            document.querySelector('#reel3 .reel-inner')
        ];

        reels.forEach(reel => reel.classList.add('spinning'));

        // Stop reels one by one
        setTimeout(() => stopReel(reels[0], results[0]), 1000);
        setTimeout(() => stopReel(reels[1], results[1]), 1500);
        setTimeout(() => stopReel(reels[2], results[2]), 2000);

        // Show result
        setTimeout(() => {
            isSpinning = false;
            spinBtn.disabled = false;
            spinBtn.classList.remove('spinning');
            spinBtn.textContent = '开始抽取';
            spinBtn.classList.add('hidden');
            respinBtn.classList.remove('hidden');

            // Display result text
            showSlotResult(results);
        }, 2500);
    }

    function stopReel(reel, result) {
        reel.classList.remove('spinning');
        const tierIndex = { silver: 0, gold: 1, prismatic: 2 };
        // 根据实际reel-item高度计算偏移（支持响应式）
        const reelItem = reel.querySelector('.reel-item');
        const itemHeight = reelItem ? reelItem.offsetHeight : 120;
        const offset = tierIndex[result] * -itemHeight;
        reel.style.transform = `translateY(${offset}px)`;
    }

    function showSlotResult(results) {
        const labels = results.map(tier =>
            `<span class="tier-label ${tier}">${tierNames[tier]}</span>`
        ).join(' → ');

        slotResultText.innerHTML = `本局海克斯顺序：${labels}`;
        slotResultText.classList.remove('hidden');
    }

    function resetSlotMachine() {
        const reels = document.querySelectorAll('.reel-inner');
        reels.forEach(reel => {
            reel.classList.remove('spinning');
            reel.style.transform = 'translateY(0)';
        });
        spinBtn.classList.remove('hidden');
        respinBtn.classList.add('hidden');
        slotResultText.classList.add('hidden');
    }

    // ==================== Card Functions ====================

    function drawCards(tier) {
        const currentStage = selectedHexCards.length + 1;
        const selectedIds = selectedHexCards.map(c => c.id);
        const stageNames = ['一', '二', '三'];

        const availableCards = allCards.filter(card => {
            // 1. 等级匹配
            if (card.tier !== tier) return false;

            // 2. 排除已选过的
            if (selectedIds.includes(card.id)) return false;

            // 3. 阶段限制检查
            if (stageRestrictions.onlyStage1.includes(card.id) && currentStage !== 1) return false;
            if (stageRestrictions.onlyStage3.includes(card.id) && currentStage !== 3) return false;
            if (stageRestrictions.notStage1.includes(card.id) && currentStage === 1) return false;
            if (stageRestrictions.notStage3.includes(card.id) && currentStage === 3) return false;

            return true;
        });

        // 随机抽取3张
        const shuffled = availableCards.sort(() => Math.random() - 0.5);
        const drawnCards = shuffled.slice(0, 3);

        // 更新标题显示当前阶段
        document.getElementById('card-display-title').textContent =
            `${stageNames[currentStage - 1]}阶段 - 选择一张海克斯`;

        displayCards(drawnCards);
        showSection('card-display');
    }

    function displayCards(cards) {
        cardsContainer.innerHTML = '';

        cards.forEach((card, index) => {
            const cardElement = createCardElement(card);
            cardElement.style.animationDelay = `${index * 0.15}s`;
            cardElement.classList.add('reveal');

            cardElement.addEventListener('click', () => {
                selectCard(card);
            });

            cardsContainer.appendChild(cardElement);
        });
    }

    function createCardElement(card) {
        const div = document.createElement('div');
        div.className = `hex-card ${card.tier}`;

        div.innerHTML = `
            <span class="card-tier-badge">${tierNames[card.tier]}</span>
            <h3 class="card-name">${card.name}</h3>
            <p class="card-description">${card.description}</p>
        `;

        return div;
    }

    function selectCard(card) {
        // 检查是否已满
        if (selectedHexCards.length >= MAX_SELECTED_HEX) {
            alert('已选择3个海克斯，无法继续添加！');
            return;
        }

        // 添加到已选列表
        selectedHexCards.push(card);
        updateSelectedHexDisplay();

        // 返回等级选择页面继续选择
        showSection('tier-selection');
    }

    function updateSelectedHexDisplay() {
        selectedHexList.innerHTML = '';
        selectedCountSpan.textContent = selectedHexCards.length;

        if (selectedHexCards.length > 0) {
            selectedHexPanel.classList.remove('hidden');
            clearSelectionBtn.classList.remove('hidden');

            const stageNames = ['一', '二', '三'];
            selectedHexCards.forEach((card, index) => {
                const miniCard = document.createElement('div');
                miniCard.className = `selected-hex-item ${card.tier}`;
                miniCard.innerHTML = `
                    <div class="hex-item-header">
                        <span class="hex-index">${stageNames[index]}阶段</span>
                        <span class="hex-name">${card.name}</span>
                        <span class="hex-tier-badge">${tierNames[card.tier]}</span>
                        <button class="remove-hex-btn" data-index="${index}">×</button>
                    </div>
                    <div class="hex-item-description">${card.description}</div>
                `;
                selectedHexList.appendChild(miniCard);
            });

            // 添加删除按钮事件
            document.querySelectorAll('.remove-hex-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(btn.dataset.index);
                    selectedHexCards.splice(index, 1);
                    updateSelectedHexDisplay();
                });
            });
        } else {
            selectedHexPanel.classList.add('hidden');
            clearSelectionBtn.classList.add('hidden');
        }
    }

    function clearSelectedHex() {
        selectedHexCards = [];
        roundCounters = [0, 0, 0];
        [0, 1, 2].forEach(i => {
            document.getElementById(`counter-${i}`).textContent = '0';
        });
        updateSelectedHexDisplay();
    }

    // ==================== UI Functions ====================

    function showSection(sectionId) {
        mainMenu.classList.add('hidden');
        slotMachine.classList.add('hidden');
        tierSelection.classList.add('hidden');
        cardDisplay.classList.add('hidden');
        resultDisplay.classList.add('hidden');

        document.getElementById(sectionId).classList.remove('hidden');
    }
});
