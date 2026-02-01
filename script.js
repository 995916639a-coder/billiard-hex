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

    // 所有海克斯卡片数据
    const allCards = [
        // 白银阶
        { id: 1, name: "重来一次", description: "本局可以重新击打一次失误的球", tier: "silver" },
        { id: 2, name: "快速思考", description: "选下后对方必须5s内打出，否则算犯规", tier: "silver" },
        { id: 3, name: "自由落位", description: "可以将白球移动到5cm距离内的点一次", tier: "silver" },
        { id: 5, name: "安全网", description: "本局第一次犯规不算", tier: "silver" },
        { id: 6, name: "黑八算你", description: "黑8算作你的球，打进后可继续击球", tier: "silver" },
        { id: 7, name: "利滚利", description: "若接下来3个回合后，你的场上球比对方少，则获得1次自由球", tier: "silver" },
        { id: 8, name: "摆烂", description: "若接下来3个回合后，你的场上球比对方多，则获得1次自由球", tier: "silver" },
        { id: 9, name: "接二连三", description: "可以对同一个球连续两次击杆,限1次", tier: "silver" },
        { id: 10, name: "贴库高手", description: "若某次白球最终贴库停住，下一杆获得1次自由球", tier: "silver" },
        { id: 11, name: "小心地雷", description: "指定对手一颗球为地雷，对手白球触碰该球即算犯规（持续2回合）", tier: "silver" },
        { id: 12, name: "铁壁防守", description: "本局击打的白球进袋和黑球提前进袋不算", tier: "silver" },
        { id: 14, name: "边角料", description: "若进的是贴库球，下一杆可获得1次额外击球机会", tier: "silver" },
        { id: 15, name: "弹幕射击", description: "本杆白球触碰到3颗以上的球，获得自由球", tier: "silver" },
        { id: 16, name: "禁止专精", description: "本局禁止对方使用专精装和擦杆橡皮", tier: "silver" },
        // 黄金阶
        { id: 17, name: "双重打击", description: "本次进球后下一杆可以连续击两次", tier: "gold" },
        { id: 18, name: "搅屎棍", description: "场上若有人打进黑八，则双方交换花色", tier: "gold" },
        { id: 19, name: "窃取", description: "对手下一颗进的球可算作你的，选择场上的任意一球与其交换位置", tier: "gold" },
        { id: 20, name: "自由落位+", description: "获得一颗自由球", tier: "gold" },
        { id: 21, name: "封印角袋", description: "指定一个角袋，对手6回合内不能使用", tier: "gold" },
        { id: 22, name: "安全网+", description: "本局的下两次犯规不算", tier: "gold" },
        { id: 23, name: "镜像空间", description: "对手下一杆必须单手击球", tier: "gold" },
        { id: 24, name: "利滚利+", description: "每隔5回合，若你的场上球比对方少2个及以上，则获得1次自由球", tier: "gold" },
        { id: 25, name: "摆烂+", description: "每隔4回合，你的场上球比对方多，则获得1次自由球", tier: "gold" },
        { id: 26, name: "命运交织", description: "选择对手一颗球绑定，本杆若你进球则该球你放在任意位置", tier: "gold" },
        { id: 27, name: "传送门", description: "（随时可用）将白球与你的任意球交换位置", tier: "gold" },
        { id: 28, name: "接二连三", description: "本局只要宣布本杆连进2球，成功额外获得1次击球", tier: "gold" },
        // 棱彩阶
        { id: 29, name: "预见未来", description: "本局对手必须提前告知下回合打哪颗球，若没做到，则算犯规", tier: "prismatic" },
        { id: 30, name: "片叶不沾身", description: "本局击打白球碰四边库且不触碰任何球，成功获得自由球并可循环发动，碰到其他球则犯规，但你的空杆不算犯规", tier: "prismatic" },
        { id: 31, name: "翻袋宣言", description: "本局只要宣布本杆打翻袋成功进球，成功获得自由球", tier: "prismatic" },
        { id: 32, name: "双倍封印", description: "指定任意两个袋口，对手本局不能使用", tier: "prismatic" },
        { id: 33, name: "我有黑哨", description: "本局所有技术犯规都不算，白球进洞只能放回原点", tier: "prismatic" },
        { id: 34, name: "轨道镭射", description: "每隔3回合，可以选择将摆球三角架放置在球台任意位置，放置持续双方各一杆", tier: "prismatic" },
        { id: 35, name: "利滚利++", description: "每隔5回合，若你的场上球比对方少，则获得1次自由球", tier: "prismatic" },
        { id: 36, name: "摆烂王++", description: "每隔3回合，若你的场上球比对方多，则获得1次自由球", tier: "prismatic" },
        { id: 37, name: "两级反转", description: "立刻与对方交换击球花色（不包括黑8）", tier: "prismatic" },
        { id: 38, name: "翻盘点", description: "若对手场上球比你少3颗以上，你立即获得2次自由球", tier: "prismatic" },
        { id: 39, name: "集合，一波！", description: "当只剩下最后一颗球时，该球进袋直接获胜，无需打黑8", tier: "prismatic" },
        { id: 40, name: "精准奇才", description: "本局距离超过半场的击球进了，则可获得一个自由球", tier: "prismatic" }
    ];

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
        showSection('main-menu');
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
        const tierCards = allCards.filter(card => card.tier === tier);
        const shuffled = tierCards.sort(() => Math.random() - 0.5);
        const drawnCards = shuffled.slice(0, 3);

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
        selectedCardContainer.innerHTML = '';

        const cardElement = createCardElement(card);
        cardElement.classList.add('reveal');
        selectedCardContainer.appendChild(cardElement);

        showSection('result-display');
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
