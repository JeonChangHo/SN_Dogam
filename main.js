let characters = []; // JSON에서 불러올 전역 변수

// DOM 요소
const data1Buttons = document.querySelectorAll('.data1-btn');
const data2Container = document.getElementById('data2-filters');
const cardContainer = document.getElementById('cards');

let selected_data1 = "스페셜";
let selected_data2 = "세븐나이츠";

// JSON 데이터 불러오기
fetch('.../dogam_info/character_info.json')
  .then(response => response.json())
  .then(data => {
    characters = data;
    init(); // 데이터 로드 후 초기화
  })
  .catch(error => {
    console.error('캐릭터 데이터 불러오기 실패:', error);
  });

// 구분1 버튼 클릭 이벤트
data1Buttons.forEach(button => {
  button.addEventListener('click', () => {
    selected_data1 = button.dataset.type;
    data1Buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    updateData2Buttons();
  });
});

// 구분2 버튼 생성 및 처리
function updateData2Buttons() {
  const data2s = [...new Set(characters.filter(c => c.data1 === selected_data1).map(c => c.data2))];
  data2Container.innerHTML = '<h2>구분 2</h2>';

  data2s.forEach(data2 => {
    const btn = document.createElement('button');
    btn.textContent = data2;
    btn.className = 'data2-btn';
    btn.addEventListener('click', () => {
      selected_data2 = data2;
      updateData2ButtonStyles();
      renderCards();
    });
    data2Container.appendChild(btn);
  });

  if (!selected_data2 || !data2s.includes(selected_data2)) {
    selected_data2 = data2s[0];
  }

  updateData2ButtonStyles();
  renderCards();
}

// 구분2 버튼 스타일 처리
function updateData2ButtonStyles() {
  const buttons = document.querySelectorAll('.data2-btn');
  buttons.forEach(btn => {
    if (btn.textContent === selected_data2) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 카드 렌더링
function renderCards() {
  const filtered = characters.filter(c => c.data1 === selected_data1 && c.data2 === selected_data2);
  cardContainer.innerHTML = '';

  filtered.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<img src="${c['image-sum']}" alt="${c.name}">`;
    card.addEventListener('click', () => {
      window.location.href = `.../character_page/character.html?id=${c.id}`;
    });
    cardContainer.appendChild(card);
  });
}

// 초기 실행
function init() {
  data1Buttons.forEach(button => {
    if (button.dataset.type === selected_data1) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  updateData2Buttons();
}

// 상단 도감 버튼 클릭 처리
document.getElementById('character-dogam').addEventListener('click', () => {
  document.getElementById('character-dogam').classList.add('active');
  document.getElementById('pet-dogam').classList.remove('active');
  document.getElementById('equip-dogam').classList.remove('active');
  document.getElementById('filters').style.display = 'flex';
});

document.getElementById('pet-dogam').addEventListener('click', () => {
  alert('펫 도감 페이지로 이동!');
});

document.getElementById('equip-dogam').addEventListener('click', () => {
  alert('장비 도감 페이지로 이동!');
});