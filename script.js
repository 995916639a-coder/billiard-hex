document.addEventListener('DOMContentLoaded', () => {
    const tierSelection = document.getElementById('tier-selection');
    const cardDisplay = document.getElementById('card-display');
    const resultDisplay = document.getElementById('result-display');
    const cardsContainer = document.getElementById('cards-container');
    const selectedCardContainer = document.getElementById('selected-card');
    const backBtn = document.getElementById('back-btn');
    const newGameBtn = document.getElementById('new-game-btn');

    // 所有海克斯卡片数据
    const allCards = [
        // 白银阶
        { id: 1, name: "重来一次", description: "本局可以重新击打一次失误的球", tier: "silver" },
        { id: 2, name: "深思熟虑", description: "击球前额外获得30秒思考时间", tier: "silver" },
        { id: 3, name: "自由落位", description: "可以将白球移动到任意位置一次", tier: "silver" },
        { id: 4, name: "预见未来", description: "对手必须提前告知打哪颗球", tier: "silver" },
        { id: 5, name: "安全网", description: "本局第一次犯规不算", tier: "silver" },
        // 黄金阶
        { id: 6, name: "双重打击", description: "本次进球后可以连续再击一次（无论下一杆是否进）", tier: "gold" },
        { id: 7, name: "颜色自由", description: "本次击球可以打任意颜色的球，进球算你的并继续", tier: "gold" },
        { id: 8, name: "窃取", description: "对手下一颗进的球算作你的", tier: "gold" },
        { id: 9, name: "复活术", description: "将一颗已进的己方球放回球台中央区域", tier: "gold" },
        { id: 10, name: "封印角袋", description: "指定一个角袋，对手接下来3杆不能用", tier: "gold" },
        // 棱彩阶
        { id: 11, name: "片叶不沾身", description: "击打白球碰四边库且不触碰任何球，成功获得自由球并可循环发动，碰到其他球则犯规", tier: "prismatic" },
        { id: 12, name: "翻袋宣言", description: "宣布本杆打翻袋进球，成功获得自由球+继续击球，失败算犯规", tier: "prismatic" },
        { id: 13, name: "连进挑战", description: "宣布本杆连进2球，成功额外获得1次击球，少于2球则换对手", tier: "prismatic" },
        { id: 14, name: "安全落位", description: "本局任意时刻可放弃当前击球，直接获得自由球机会（仅限1次）", tier: "prismatic" },
        { id: 15, name: "双倍封印", description: "指定两个袋口，对手本局不能使用（比黄金阶封印更强）", tier: "prismatic" }
    ];

    const tierNames = {
        silver: '白银阶',
        gold: '黄金阶',
        prismatic: '棱彩阶'
    };

    // Tier button click handlers
    document.querySelectorAll('.tier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tier = btn.dataset.tier;
            drawCards(tier);
        });
    });

    // Back button handler
    backBtn.addEventListener('click', () => {
        showSection('tier-selection');
    });

    // New game button handler
    newGameBtn.addEventListener('click', () => {
        showSection('tier-selection');
    });

    // 随机抽取指定等级的卡片
    function drawCards(tier) {
        // 筛选指定等级的卡片
        const tierCards = allCards.filter(card => card.tier === tier);

        // 随机打乱
        const shuffled = tierCards.sort(() => Math.random() - 0.5);

        // 取前3张
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

    function showSection(sectionId) {
        tierSelection.classList.add('hidden');
        cardDisplay.classList.add('hidden');
        resultDisplay.classList.add('hidden');

        document.getElementById(sectionId).classList.remove('hidden');
    }
});
