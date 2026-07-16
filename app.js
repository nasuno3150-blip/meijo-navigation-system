// ========================================
// メインアプリケーション
// ========================================

// 言語設定
let currentLanguage = 'ja';

// 現在の状態
let currentStartLocation = null;
let currentDestination = null;
let currentRoute = null;
let allRoutes = null;
let currentFloor = 1; // 表示中の階

// QRコード読み込み関連
let qrVideoStream = null;
let isQRScanning = false;

// 地図画像キャッシュ
const floorImages = {};

// 言語辞書
const i18n = {
    ja: {
        'qr-title': '出発地点',
        'qr-btn-text': 'カメラで読み込み',
        'destination-title': '目的地',
        'options-title': 'オプション',
        'escalator-label': 'エスカレーター優先',
        'elevator-label': 'エレベーター優先',
        'search-text': 'ルート検索',
        'route-title': 'ルート情報',
        'close-camera': 'キャンセル',
        'select-destination': '目的地を選択してください',
        'select-start': '出発地点を選択してください',
        'route-found': 'ルートが見つかりました',
        'no-route': 'ルートが見つかりません',
        'distance': '距離',
        'time': '所要時間',
        'meter': 'm',
        'minute': '分',
        'stairs-route': '階段経由',
        'escalator-route': 'エスカレーター経由',
        'select-route': 'ルートを選択してください',
        'go': 'に向かって進みます',
        'turn-left': '左に曲がります',
        'turn-right': '右に曲がります',
        'go-straight': 'まっすぐ進みます',
        'use-escalator': 'エスカレーターを使用します',
        'use-stairs': '階段を使用します',
        'arrived': '到着しました',
        'camera-permission-denied': 'カメラへのアクセスが拒否されました',
        'qr-error': 'QRコード読み込みエラー',
        'no-nodes': 'ノードが見つかりません'
    },
    en: {
        'qr-title': 'Starting Point',
        'qr-btn-text': 'Scan QR Code',
        'destination-title': 'Destination',
        'options-title': 'Options',
        'escalator-label': 'Prioritize Escalator',
        'elevator-label': 'Prioritize Elevator',
        'search-text': 'Search Route',
        'route-title': 'Route Information',
        'close-camera': 'Cancel',
        'select-destination': 'Please select destination',
        'select-start': 'Please select starting point',
        'route-found': 'Route found',
        'no-route': 'No route found',
        'distance': 'Distance',
        'time': 'Time',
        'meter': 'm',
        'minute': 'min',
        'stairs-route': 'Via Stairs',
        'escalator-route': 'Via Escalator',
        'select-route': 'Please select a route',
        'go': 'Head towards',
        'turn-left': 'Turn left',
        'turn-right': 'Turn right',
        'go-straight': 'Go straight',
        'use-escalator': 'Use escalator',
        'use-stairs': 'Use stairs',
        'arrived': 'Arrived',
        'camera-permission-denied': 'Camera access denied',
        'qr-error': 'QR Code scanning error',
        'no-nodes': 'No nodes found'
    }
};

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadFloorImages();
    drawMap();
    populateDestinationList();
});

// ========================================
// 地図画像の読み込み
// ========================================
function loadFloorImages() {
    for (let floor = 1; floor <= 2; floor++) {
        const img = new Image();
        img.src = FLOOR_IMAGES[floor];
        img.onload = () => {
            floorImages[floor] = img;
            if (floor === currentFloor) {
                drawMap();
            }
        };
        img.onerror = () => {
            console.error(`Floor ${floor} image failed to load: ${FLOOR_IMAGES[floor]}`);
        };
    }
}

// ========================================
// イベントリスナー設定
// ========================================
function initializeEventListeners() {
    // 言語選択
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => changeLanguage(e.target.dataset.lang));
    });

    // QRコード読み込み
    document.getElementById('start-qr-btn').addEventListener('click', startQRScanning);
    document.getElementById('close-camera-btn').addEventListener('click', stopQRScanning);

    // 目的地検索
    document.getElementById('destination-search').addEventListener('input', (e) => {
        filterDestinations(e.target.value);
    });

    // ルート検索
    document.getElementById('search-route-btn').addEventListener('click', searchRoute);

    // 地図クリック
    document.getElementById('map-canvas').addEventListener('click', (e) => {
        handleMapClick(e);
    });

    // エスカレーター優先チェックボックス
    document.getElementById('escalator-priority').addEventListener('change', () => {
        document.getElementById('elevator-priority').checked = false;
    });

    // エレベーター優先チェックボックス
    document.getElementById('elevator-priority').addEventListener('change', () => {
        document.getElementById('escalator-priority').checked = false;
    });
}

// ========================================
// 言語変更
// ========================================
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // 言語ボタンの更新
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });

    // テキストの更新
    updateUIText();
    populateDestinationList();
}

function updateUIText() {
    const texts = {
        'qr-title': 'qr-title',
        'qr-btn-text': 'qr-btn-text',
        'destination-title': 'destination-title',
        'options-title': 'options-title',
        'escalator-label': 'escalator-label',
        'elevator-label': 'elevator-label',
        'search-text': 'search-text',
        'route-title': 'route-title'
    };

    for (const [id, key] of Object.entries(texts)) {
        const element = document.getElementById(id);
        if (element && i18n[currentLanguage][key]) {
            element.textContent = i18n[currentLanguage][key];
        }
    }
}

// ========================================
// QRコード読み込み機能
// ========================================
async function startQRScanning() {
    const videoContainer = document.getElementById('qr-video-container');
    const video = document.getElementById('qr-video');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        qrVideoStream = stream;
        video.srcObject = stream;
        videoContainer.style.display = 'block';
        isQRScanning = true;

        // QRコード読み込みループ開始
        scanQRCode(video);
    } catch (error) {
        showError(i18n[currentLanguage]['camera-permission-denied']);
    }
}

function stopQRScanning() {
    isQRScanning = false;
    
    if (qrVideoStream) {
        qrVideoStream.getTracks().forEach(track => track.stop());
    }

    document.getElementById('qr-video-container').style.display = 'none';
}

function scanQRCode(video) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    function scan() {
        if (!isQRScanning) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                const qrData = code.data;
                
                // QRコードデータが有効なノードIDかチェック
                if (NODES[qrData]) {
                    currentStartLocation = qrData;
                    const node = NODES[qrData];
                    document.getElementById('start-location').value = 
                        currentLanguage === 'ja' ? node.nameJa : node.nameEn;
                    
                    stopQRScanning();
                    showNotification(`出発地点: ${currentLanguage === 'ja' ? node.nameJa : node.nameEn}`);
                } else {
                    showError(`${i18n[currentLanguage]['qr-error']}: ${qrData}`);
                }
            }
        }

        requestAnimationFrame(scan);
    }

    scan();
}

// ========================================
// 目的地リスト管理
// ========================================
function populateDestinationList() {
    const allNodes = graph.getAllNodes()
        .filter(node => node.type !== 'waypoint')
        .sort((a, b) => {
            const nameA = currentLanguage === 'ja' ? a.nameJa : a.nameEn;
            const nameB = currentLanguage === 'ja' ? b.nameJa : b.nameEn;
            return nameA.localeCompare(nameB, currentLanguage);
        });

    displayDestinationList(allNodes);
}

function displayDestinationList(nodes) {
    const list = document.getElementById('destination-list');
    list.innerHTML = '';

    nodes.forEach(node => {
        const item = document.createElement('div');
        item.className = 'destination-item';
        item.textContent = currentLanguage === 'ja' ? node.nameJa : node.nameEn;
        
        item.addEventListener('click', () => {
            currentDestination = node.name;
            document.querySelectorAll('.destination-item').forEach(el => {
                el.classList.remove('selected');
            });
            item.classList.add('selected');
            list.classList.remove('active');
        });

        list.appendChild(item);
    });
}

function filterDestinations(searchTerm) {
    const list = document.getElementById('destination-list');
    
    if (searchTerm.length === 0) {
        list.classList.remove('active');
        return;
    }

    list.classList.add('active');
    
    const filtered = graph.getAllNodes()
        .filter(node => {
            const name = currentLanguage === 'ja' ? node.nameJa : node.nameEn;
            return name.toLowerCase().includes(searchTerm.toLowerCase());
        });

    displayDestinationList(filtered);
}

// ========================================
// ルート検索（Dijkstraアルゴリズム）
// ========================================
function searchRoute() {
    if (!currentStartLocation) {
        showError(i18n[currentLanguage]['select-start']);
        return;
    }

    if (!currentDestination) {
        showError(i18n[currentLanguage]['select-destination']);
        return;
    }

    // ルートを計算
    allRoutes = findAllRoutes(currentStartLocation, currentDestination);

    if (!allRoutes || allRoutes.length === 0) {
        showError(i18n[currentLanguage]['no-route']);
        return;
    }

    displayRouteOptions();
}

function findAllRoutes(startNodeId, endNodeId) {
    const startNode = graph.getNode(startNodeId);
    const endNode = graph.getNode(endNodeId);

    if (!startNode || !endNode) return null;

    // 同じ階のルートを検索
    if (startNode.floor === endNode.floor) {
        const route = dijkstra(startNodeId, endNodeId);
        return route ? [route] : null;
    }

    // 異なる階の場合、エスカレーターと階段の両方を検索
    const escalatorRoute = dijkstra(startNodeId, endNodeId, 'escalator');
    const stairsRoute = dijkstra(startNodeId, endNodeId, 'stairs');

    const routes = [];
    if (escalatorRoute) routes.push(escalatorRoute);
    if (stairsRoute) routes.push(stairsRoute);

    return routes.length > 0 ? routes : null;
}

function dijkstra(startNodeId, endNodeId, preferredTransition = null) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // 初期化
    for (const [nodeId] of graph.nodes) {
        distances.set(nodeId, Infinity);
        unvisited.add(nodeId);
    }
    distances.set(startNodeId, 0);

    while (unvisited.size > 0) {
        // 未訪問ノードの中から最小距離のノードを選択
        let minNode = null;
        let minDistance = Infinity;

        for (const nodeId of unvisited) {
            if (distances.get(nodeId) < minDistance) {
                minDistance = distances.get(nodeId);
                minNode = nodeId;
            }
        }

        if (minNode === null || minDistance === Infinity) break;

        unvisited.delete(minNode);

        if (minNode === endNodeId) {
            // ルートを再構築
            const route = [];
            let current = endNodeId;

            while (current !== undefined) {
                route.unshift(current);
                current = previous.get(current);
            }

            return {
                path: route,
                distance: distances.get(endNodeId),
                type: preferredTransition
            };
        }

        // 隣接ノードを処理
        const neighbors = graph.getNeighbors(minNode);

        for (const neighbor of neighbors) {
            // 階段/エスカレーター優先フィルタリング
            if (preferredTransition && neighbor.type !== preferredTransition && neighbor.type !== 'normal') {
                continue;
            }

            const newDistance = distances.get(minNode) + neighbor.distance;

            if (newDistance < distances.get(neighbor.to)) {
                distances.set(neighbor.to, newDistance);
                previous.set(neighbor.to, minNode);
            }
        }
    }

    return null;
}

// ========================================
// ルートオプション表示
// ========================================
function displayRouteOptions() {
    const routeInfoSection = document.getElementById('route-info-section');
    const routeOptionsContainer = document.getElementById('route-options');
    
    routeInfoSection.style.display = 'block';
    routeOptionsContainer.innerHTML = '';

    allRoutes.forEach((route, index) => {
        const typeLabel = route.type === 'escalator' ? 
            i18n[currentLanguage]['escalator-route'] : 
            i18n[currentLanguage]['stairs-route'];

        const btn = document.createElement('button');
        btn.className = 'route-option-btn';
        btn.textContent = `${typeLabel} - ${(route.distance | 0)}${i18n[currentLanguage]['meter']}`;
        
        btn.addEventListener('click', () => {
            selectRoute(route, index);
        });

        routeOptionsContainer.appendChild(btn);
    });
}

function selectRoute(route, index) {
    currentRoute = route;

    // ボタンの選択状態を更新
    document.querySelectorAll('.route-option-btn').forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    // ルート情報を表示
    displayRouteInfo(route);

    // 地図にルートを描画
    drawMap();
    drawRoute(route);
}

function displayRouteInfo(route) {
    const distance = (route.distance | 0);
    const estimatedTime = Math.ceil(distance / 1.4); // 平均歩行速度: 1.4m/s

    document.getElementById('distance-info').textContent = 
        `${i18n[currentLanguage]['distance']}: ${distance}${i18n[currentLanguage]['meter']}`;
    
    document.getElementById('time-info').textContent = 
        `${i18n[currentLanguage]['time']}: 約${estimatedTime}${i18n[currentLanguage]['minute']}`;

    displayDirections(route);
}

function displayDirections(route) {
    const directionsList = document.getElementById('directions-list');
    directionsList.innerHTML = '';

    for (let i = 0; i < route.path.length; i++) {
        const currentNodeId = route.path[i];
        const nextNodeId = route.path[i + 1];
        const node = graph.getNode(currentNodeId);

        const directionItem = document.createElement('div');
        directionItem.className = 'direction-item';

        if (i === 0) {
            const name = currentLanguage === 'ja' ? node.nameJa : node.nameEn;
            directionItem.textContent = `${i + 1}. ${name}${i18n[currentLanguage]['go']}`;
            directionItem.classList.add('important');
        } else if (i === route.path.length - 1) {
            const name = currentLanguage === 'ja' ? node.nameJa : node.nameEn;
            directionItem.textContent = `${i + 1}. ${name} - ${i18n[currentLanguage]['arrived']}`;
            directionItem.classList.add('important');
        } else {
            const neighbors = graph.getNeighbors(currentNodeId);
            const nextNode = neighbors.find(n => n.to === nextNodeId);

            if (nextNode && nextNode.type === 'escalator') {
                directionItem.textContent = `${i + 1}. ${i18n[currentLanguage]['use-escalator']}`;
            } else if (nextNode && nextNode.type === 'stairs') {
                directionItem.textContent = `${i + 1}. ${i18n[currentLanguage]['use-stairs']}`;
            } else {
                const name = currentLanguage === 'ja' ? node.nameJa : node.nameEn;
                directionItem.textContent = `${i + 1}. ${name}${i18n[currentLanguage]['go-straight']}`;
            }
        }

        directionsList.appendChild(directionItem);
    }
}

// ========================================
// 地図描画機能
// ========================================
function drawMap() {
    const canvas = document.getElementById('map-canvas');
    const ctx = canvas.getContext('2d');

    // キャンバスサイズ調整
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // スケール計算
    const scale = {
        x: canvas.width / MAP_WIDTH,
        y: canvas.height / MAP_HEIGHT
    };

    // 背景を描画
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 地図画像を描画（読み込み済みの場合）
    if (floorImages[currentFloor]) {
        const img = floorImages[currentFloor];
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } else {
        // 画像未読み込みの場合は背景色のみ
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('地図を読み込み中...', canvas.width / 2, canvas.height / 2);
    }

    // ノードを描画
    const nodes = graph.getAllNodes();
    
    nodes.forEach(node => {
        if (node.floor === currentFloor) {
            drawNode(ctx, node, scale);
        }
    });
}

function drawNode(ctx, node, scale) {
    const x = node.x * scale.x;
    const y = node.y * scale.y;

    // ノードの色を決定
    let color = '#e0e0e0';
    let textColor = '#333';
    let radius = 12;

    if (node.type === 'classroom') {
        color = '#dcf5f5';
        textColor = '#0097a7';
        radius = 14;
    } else if (node.type === 'escalator') {
        color = '#ffe0b2';
        textColor = '#e65100';
        radius = 13;
    } else if (node.type === 'stairs') {
        color = '#f0f4c3';
        textColor = '#558b2f';
        radius = 13;
    } else if (node.type === 'facility') {
        color = '#f3e5f5';
        textColor = '#6a1b9a';
        radius = 14;
    } else if (node.type === 'entrance') {
        color = '#ffccbc';
        textColor = '#d84315';
        radius = 14;
    } else if (node.type === 'waypoint') {
        return; // ウェイポイントは非表示
    }

    // ノードを描画
    ctx.fillStyle = color;
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // ノードのラベルを描画
    ctx.fillStyle = textColor;
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, x, y);
}

function drawRoute(route) {
    const canvas = document.getElementById('map-canvas');
    const ctx = canvas.getContext('2d');

    const scale = {
        x: canvas.width / MAP_WIDTH,
        y: canvas.height / MAP_HEIGHT
    };

    ctx.strokeStyle = '#dc143c';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);

    for (let i = 0; i < route.path.length - 1; i++) {
        const from = graph.getNode(route.path[i]);
        const to = graph.getNode(route.path[i + 1]);

        if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x * scale.x, from.y * scale.y);
            ctx.lineTo(to.x * scale.x, to.y * scale.y);
            ctx.stroke();
        }
    }

    ctx.setLineDash([]);
}

// ========================================
// 地図クリックハンドラー
// ========================================
function handleMapClick(event) {
    const canvas = document.getElementById('map-canvas');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const scale = {
        x: MAP_WIDTH / canvas.width,
        y: MAP_HEIGHT / canvas.height
    };

    const mapX = x * scale.x;
    const mapY = y * scale.y;

    // 最も近いノードを見つける
    const nodes = graph.getAllNodes().filter(n => n.floor === currentFloor);
    let closestNode = null;
    let minDistance = Infinity;

    nodes.forEach(node => {
        const dx = node.x - mapX;
        const dy = node.y - mapY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 40 && distance < minDistance) {
            minDistance = distance;
            closestNode = node;
        }
    });

    if (closestNode) {
        currentDestination = closestNode.name;
        const name = currentLanguage === 'ja' ? closestNode.nameJa : closestNode.nameEn;
        document.getElementById('destination-search').value = name;
        
        // 目的地リストを更新
        const search = document.getElementById('destination-search');
        search.value = name;
        filterDestinations(name);
    }
}

// ========================================
// ユーティリティ関数
// ========================================
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showNotification(message) {
    console.log(message);
}
