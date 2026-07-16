// ========================================
// 座標データとグラフ構造
// ========================================

// キャンバスの基準座標（実際の地図画像のサイズに合わせて調整）
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 900;

// 1階と2階の距離を計算するための重み付け
const FLOOR_DISTANCE_WEIGHT = 500;

// ========================================
// ノード（場所）の定義
// ========================================
const NODES = {
    // 1階の教室・施設
    '1C': {
        name: '1C',
        floor: 1,
        x: 150,
        y: 100,
        type: 'classroom',
        nameJa: '1C教室',
        nameEn: 'Class 1C'
    },
    '1B': {
        name: '1B',
        floor: 1,
        x: 280,
        y: 100,
        type: 'classroom',
        nameJa: '1B教室',
        nameEn: 'Class 1B'
    },
    '1A': {
        name: '1A',
        floor: 1,
        x: 400,
        y: 100,
        type: 'classroom',
        nameJa: '1A教室',
        nameEn: 'Class 1A'
    },
    '1D': {
        name: '1D',
        floor: 1,
        x: 100,
        y: 180,
        type: 'classroom',
        nameJa: '1D教室',
        nameEn: 'Class 1D'
    },
    '1E': {
        name: '1E',
        floor: 1,
        x: 100,
        y: 260,
        type: 'classroom',
        nameJa: '1E教室',
        nameEn: 'Class 1E'
    },
    '1F': {
        name: '1F',
        floor: 1,
        x: 100,
        y: 340,
        type: 'classroom',
        nameJa: '1F教室',
        nameEn: 'Class 1F'
    },
    '1G': {
        name: '1G',
        floor: 1,
        x: 100,
        y: 420,
        type: 'classroom',
        nameJa: '1G教室',
        nameEn: 'Class 1G'
    },
    '1H': {
        name: '1H',
        floor: 1,
        x: 100,
        y: 500,
        type: 'classroom',
        nameJa: '1H教室',
        nameEn: 'Class 1H'
    },
    '1I': {
        name: '1I',
        floor: 1,
        x: 180,
        y: 580,
        type: 'classroom',
        nameJa: '1I教室',
        nameEn: 'Class 1I'
    },
    'fountain_1': {
        name: 'fountain_1',
        floor: 1,
        x: 240,
        y: 340,
        type: 'waypoint',
        nameJa: '噴水',
        nameEn: 'Fountain'
    },
    'escalator_down_1': {
        name: 'escalator_down_1',
        floor: 1,
        x: 520,
        y: 280,
        type: 'escalator',
        nameJa: '下りエスカレーター',
        nameEn: 'Down Escalator'
    },
    'escalator_up_1': {
        name: 'escalator_up_1',
        floor: 1,
        x: 560,
        y: 280,
        type: 'escalator',
        nameJa: '上りエスカレーター',
        nameEn: 'Up Escalator'
    },
    'library': {
        name: 'library',
        floor: 1,
        x: 600,
        y: 240,
        type: 'facility',
        nameJa: '図書室',
        nameEn: 'Library'
    },
    'insurance': {
        name: 'insurance',
        floor: 1,
        x: 600,
        y: 320,
        type: 'facility',
        nameJa: '保険室',
        nameEn: 'Insurance Office'
    },
    'office_1': {
        name: 'office_1',
        floor: 1,
        x: 900,
        y: 200,
        type: 'facility',
        nameJa: '職員室',
        nameEn: 'Staff Office'
    },
    'entrance_1': {
        name: 'entrance_1',
        floor: 1,
        x: 950,
        y: 550,
        type: 'entrance',
        nameJa: '玄関出入口',
        nameEn: 'Main Entrance'
    },
    'stairs_1': {
        name: 'stairs_1',
        floor: 1,
        x: 380,
        y: 520,
        type: 'stairs',
        nameJa: '階段（1階）',
        nameEn: 'Stairs (1F)'
    },
    'multipurpose_1': {
        name: 'multipurpose_1',
        floor: 1,
        x: 650,
        y: 500,
        type: 'classroom',
        nameJa: '多目的室',
        nameEn: 'Multipurpose Room'
    },
    'year1_assembly': {
        name: 'year1_assembly',
        floor: 1,
        x: 300,
        y: 580,
        type: 'classroom',
        nameJa: '1年分室',
        nameEn: '1st Year Assembly'
    },
    'student_council': {
        name: 'student_council',
        floor: 1,
        x: 380,
        y: 580,
        type: 'classroom',
        nameJa: '生徒会',
        nameEn: 'Student Council'
    },

    // 2階の教室・施設
    '2C': {
        name: '2C',
        floor: 2,
        x: 150,
        y: 100,
        type: 'classroom',
        nameJa: '2C教室',
        nameEn: 'Class 2C'
    },
    '2B': {
        name: '2B',
        floor: 2,
        x: 280,
        y: 100,
        type: 'classroom',
        nameJa: '2B教室',
        nameEn: 'Class 2B'
    },
    '2A': {
        name: '2A',
        floor: 2,
        x: 400,
        y: 100,
        type: 'classroom',
        nameJa: '2A教室',
        nameEn: 'Class 2A'
    },
    '2D': {
        name: '2D',
        floor: 2,
        x: 100,
        y: 180,
        type: 'classroom',
        nameJa: '2D教室',
        nameEn: 'Class 2D'
    },
    '2E': {
        name: '2E',
        floor: 2,
        x: 100,
        y: 260,
        type: 'classroom',
        nameJa: '2E教室',
        nameEn: 'Class 2E'
    },
    '2F': {
        name: '2F',
        floor: 2,
        x: 100,
        y: 340,
        type: 'classroom',
        nameJa: '2F教室',
        nameEn: 'Class 2F'
    },
    '2G': {
        name: '2G',
        floor: 2,
        x: 100,
        y: 420,
        type: 'classroom',
        nameJa: '2G教室',
        nameEn: 'Class 2G'
    },
    '2H': {
        name: '2H',
        floor: 2,
        x: 100,
        y: 500,
        type: 'classroom',
        nameJa: '2H教室',
        nameEn: 'Class 2H'
    },
    '2I': {
        name: '2I',
        floor: 2,
        x: 180,
        y: 580,
        type: 'classroom',
        nameJa: '2I教室',
        nameEn: 'Class 2I'
    },
    'year2_assembly': {
        name: 'year2_assembly',
        floor: 2,
        x: 280,
        y: 580,
        type: 'classroom',
        nameJa: '2年分室',
        nameEn: '2nd Year Assembly'
    },
    'year3_assembly': {
        name: 'year3_assembly',
        floor: 2,
        x: 400,
        y: 580,
        type: 'classroom',
        nameJa: '3年分室',
        nameEn: '3rd Year Assembly'
    },
    'emission_hall': {
        name: 'emission_hall',
        floor: 2,
        x: 240,
        y: 340,
        type: 'classroom',
        nameJa: '吹き抜け',
        nameEn: 'Atrium'
    },
    'escalator_down_2': {
        name: 'escalator_down_2',
        floor: 2,
        x: 520,
        y: 280,
        type: 'escalator',
        nameJa: '下りエスカレーター',
        nameEn: 'Down Escalator'
    },
    'escalator_up_2': {
        name: 'escalator_up_2',
        floor: 2,
        x: 560,
        y: 280,
        type: 'escalator',
        nameJa: '上りエスカレーター',
        nameEn: 'Up Escalator'
    },
    'guidance': {
        name: 'guidance',
        floor: 2,
        x: 600,
        y: 240,
        type: 'facility',
        nameJa: '指導室',
        nameEn: 'Guidance Office'
    },
    'principal': {
        name: 'principal',
        floor: 2,
        x: 600,
        y: 320,
        type: 'facility',
        nameJa: '校長室',
        nameEn: "Principal's Office"
    },
    'warehouse': {
        name: 'warehouse',
        floor: 2,
        x: 520,
        y: 100,
        type: 'facility',
        nameJa: '倉庫',
        nameEn: 'Warehouse'
    },
    '3I': {
        name: '3I',
        floor: 2,
        x: 750,
        y: 100,
        type: 'classroom',
        nameJa: '3I教室',
        nameEn: 'Class 3I'
    },
    '3H': {
        name: '3H',
        floor: 2,
        x: 850,
        y: 100,
        type: 'classroom',
        nameJa: '3H教室',
        nameEn: 'Class 3H'
    },
    '3G': {
        name: '3G',
        floor: 2,
        x: 950,
        y: 150,
        type: 'classroom',
        nameJa: '3G教室',
        nameEn: 'Class 3G'
    },
    '3F': {
        name: '3F',
        floor: 2,
        x: 950,
        y: 250,
        type: 'classroom',
        nameJa: '3F教室',
        nameEn: 'Class 3F'
    },
    '3E': {
        name: '3E',
        floor: 2,
        x: 950,
        y: 350,
        type: 'classroom',
        nameJa: '3E教室',
        nameEn: 'Class 3E'
    },
    '3D': {
        name: '3D',
        floor: 2,
        x: 950,
        y: 450,
        type: 'classroom',
        nameJa: '3D教室',
        nameEn: 'Class 3D'
    },
    '3C': {
        name: '3C',
        floor: 2,
        x: 950,
        y: 550,
        type: 'classroom',
        nameJa: '3C教室',
        nameEn: 'Class 3C'
    },
    'empty_classroom': {
        name: 'empty_classroom',
        floor: 2,
        x: 750,
        y: 520,
        type: 'classroom',
        nameJa: '空き教室',
        nameEn: 'Empty Classroom'
    },
    '3A': {
        name: '3A',
        floor: 2,
        x: 850,
        y: 520,
        type: 'classroom',
        nameJa: '3A教室',
        nameEn: 'Class 3A'
    },
    '3B': {
        name: '3B',
        floor: 2,
        x: 950,
        y: 520,
        type: 'classroom',
        nameJa: '3B教室',
        nameEn: 'Class 3B'
    },
    'stairs_2': {
        name: 'stairs_2',
        floor: 2,
        x: 380,
        y: 520,
        type: 'stairs',
        nameJa: '階段（2階）',
        nameEn: 'Stairs (2F)'
    },

    // ウェイポイント（移動経路用）
    'wp_1_1': {
        name: 'wp_1_1',
        floor: 1,
        x: 200,
        y: 150,
        type: 'waypoint',
        nameJa: 'ウェイポイント',
        nameEn: 'Waypoint'
    },
    'wp_1_2': {
        name: 'wp_1_2',
        floor: 1,
        x: 500,
        y: 150,
        type: 'waypoint',
        nameJa: 'ウェイポイント',
        nameEn: 'Waypoint'
    },
    'wp_1_3': {
        name: 'wp_1_3',
        floor: 1,
        x: 700,
        y: 400,
        type: 'waypoint',
        nameJa: 'ウェイポイント',
        nameEn: 'Waypoint'
    },
    'wp_2_1': {
        name: 'wp_2_1',
        floor: 2,
        x: 200,
        y: 150,
        type: 'waypoint',
        nameJa: 'ウェイポイント',
        nameEn: 'Waypoint'
    },
    'wp_2_2': {
        name: 'wp_2_2',
        floor: 2,
        x: 700,
        y: 100,
        type: 'waypoint',
        nameJa: 'ウェイポイント',
        nameEn: 'Waypoint'
    },
    'wp_2_3': {
        name: 'wp_2_3',
        floor: 2,
        x: 700,
        y: 500,
        type: 'waypoint',
        nameJa: 'ウェイポイント',
        nameEn: 'Waypoint'
    }
};

// ========================================
// エッジ（接続）の定義
// ========================================
const EDGES = [
    // 1階の接続
    { from: '1C', to: 'wp_1_1', distance: 50 },
    { from: 'wp_1_1', to: '1B', distance: 40 },
    { from: '1B', to: '1A', distance: 50 },
    { from: '1A', to: 'wp_1_2', distance: 80 },
    
    { from: '1C', to: '1D', distance: 80 },
    { from: '1D', to: '1E', distance: 80 },
    { from: '1E', to: '1F', distance: 80 },
    { from: '1F', to: '1G', distance: 80 },
    { from: '1G', to: '1H', distance: 80 },
    
    { from: '1D', to: 'fountain_1', distance: 150 },
    { from: 'fountain_1', to: 'escalator_down_1', distance: 200 },
    { from: 'fountain_1', to: 'stairs_1', distance: 150 },
    
    { from: 'escalator_down_1', to: 'escalator_up_1', distance: 30 },
    { from: 'escalator_up_1', to: 'library', distance: 40 },
    { from: 'library', to: 'insurance', distance: 80 },
    
    { from: 'escalator_down_1', to: 'wp_1_3', distance: 150 },
    { from: 'wp_1_3', to: 'multipurpose_1', distance: 80 },
    { from: 'multipurpose_1', to: 'entrance_1', distance: 300 },
    
    { from: 'stairs_1', to: 'multipurpose_1', distance: 250 },
    { from: 'stairs_1', to: 'year1_assembly', distance: 100 },
    { from: 'year1_assembly', to: 'student_council', distance: 80 },
    
    { from: 'insurance', to: 'office_1', distance: 300 },
    { from: 'office_1', to: 'entrance_1', distance: 400 },

    // 2階の接続
    { from: '2C', to: 'wp_2_1', distance: 50 },
    { from: 'wp_2_1', to: '2B', distance: 40 },
    { from: '2B', to: '2A', distance: 50 },
    { from: '2A', to: 'warehouse', distance: 120 },
    
    { from: '2C', to: '2D', distance: 80 },
    { from: '2D', to: '2E', distance: 80 },
    { from: '2E', to: '2F', distance: 80 },
    { from: '2F', to: '2G', distance: 80 },
    { from: '2G', to: '2H', distance: 80 },
    
    { from: '2D', to: 'emission_hall', distance: 150 },
    { from: 'emission_hall', to: 'escalator_down_2', distance: 150 },
    { from: 'emission_hall', to: 'stairs_2', distance: 150 },
    
    { from: 'escalator_down_2', to: 'escalator_up_2', distance: 30 },
    { from: 'escalator_up_2', to: 'guidance', distance: 40 },
    { from: 'guidance', to: 'principal', distance: 80 },
    
    { from: 'warehouse', to: 'wp_2_2', distance: 80 },
    { from: 'wp_2_2', to: '3I', distance: 60 },
    { from: '3I', to: '3H', distance: 80 },
    { from: '3H', to: '3G', distance: 80 },
    { from: '3G', to: '3F', distance: 100 },
    { from: '3F', to: '3E', distance: 100 },
    { from: '3E', to: '3D', distance: 100 },
    { from: '3D', to: '3C', distance: 100 },
    
    { from: '2I', to: 'year2_assembly', distance: 100 },
    { from: 'year2_assembly', to: 'year3_assembly', distance: 100 },
    { from: 'year3_assembly', to: 'wp_2_3', distance: 150 },
    { from: 'wp_2_3', to: 'empty_classroom', distance: 80 },
    { from: 'empty_classroom', to: '3A', distance: 80 },
    { from: '3A', to: '3B', distance: 80 },
    
    { from: 'stairs_2', to: '2I', distance: 100 },
    { from: 'stairs_2', to: 'year2_assembly', distance: 150 },

    // 階段経由での1階と2階の接続
    { from: 'stairs_1', to: 'stairs_2', distance: 150, type: 'stairs' },
    
    // エスカレーター経由での1階と2階の接続
    { from: 'escalator_down_1', to: 'escalator_down_2', distance: 150, type: 'escalator' },
    { from: 'escalator_up_1', to: 'escalator_up_2', distance: 150, type: 'escalator' },
];

// ========================================
// ルート検索用のグラフクラス
// ========================================
class Graph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
        
        // ノードを初期化
        for (const [nodeId, nodeData] of Object.entries(NODES)) {
            this.nodes.set(nodeId, nodeData);
            this.edges.set(nodeId, []);
        }
        
        // エッジを追加
        for (const edge of EDGES) {
            this.edges.get(edge.from).push({
                to: edge.to,
                distance: edge.distance,
                type: edge.type || 'normal'
            });
        }
    }
    
    // ノードを取得
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }
    
    // ノードの隣接ノードを取得
    getNeighbors(nodeId) {
        return this.edges.get(nodeId) || [];
    }
    
    // 全ノードを取得
    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    // 距離を計算（ユークリッド距離 + 階数の重み付け）
    calculateDistance(from, to) {
        const fromNode = this.nodes.get(from);
        const toNode = this.nodes.get(to);
        
        if (!fromNode || !toNode) return Infinity;
        
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const euclidean = Math.sqrt(dx * dx + dy * dy);
        
        // 階が異なる場合、追加の距離を加える
        const floorDiff = Math.abs(toNode.floor - fromNode.floor) * FLOOR_DISTANCE_WEIGHT;
        
        return euclidean + floorDiff;
    }
}

// グローバルグラフインスタンス
const graph = new Graph();
