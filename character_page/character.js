// character.js

Promise.all([
  fetch('../dogam_info/character_info.json').then(res => res.json()),
  fetch('../dogam_info/character_profile.json').then(res => res.json()),
  fetch('../dogam_info/character_skill.json').then(res => res.json()),
  fetch('../dogam_info/character_tooltip.json').then(res => res.json())
]).then(([characterData, profileData, skillData, tooltipData]) => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const character = characterData.find(c => c.id == id);
  const profile = profileData.find(p => p.id == id);
  const skillInfo = skillData.find(s => s.id == id);

  if (character) {
    const mainImg = document.getElementById('character-img');
    const thumbnails = [
      document.getElementById('image-mini'),
      document.getElementById('image-mini2'),
      document.getElementById('image-mini3')
    ];

    const imageMap = [
      { thumb: 'image-mini', full: 'image-full' },
      { thumb: 'image-mini2', full: 'image-full2' },
      { thumb: 'image-mini3', full: 'image-full3' }
    ];

    let currentIndex = 0;

    thumbnails.forEach((thumb, i) => {
      const keyThumb = imageMap[i].thumb;
      thumb.src = character[keyThumb] ? '../' + character[keyThumb] : '';
      thumb.addEventListener('click', () => {
        currentIndex = i;
        updateImage(currentIndex);
      });
    });

    function updateImage(index) {
      const keyFull = imageMap[index].full;
      mainImg.src = character[keyFull] ? '../' + character[keyFull] : '';
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
      });
    }

    document.getElementById('left-arrow').addEventListener('click', () => {
      currentIndex = (currentIndex + 2) % 3;
      updateImage(currentIndex);
    });

    document.getElementById('right-arrow').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % 3;
      updateImage(currentIndex);
    });

    updateImage(currentIndex);

    // 모든 데이터를 하나로 합치기
    const mergedData = { ...(character || {}), ...(profile || {}), ...(skillInfo || {}) };

    // 툴팁 적용 함수
    function applyTooltip(htmlString, tooltipDict) {
      let result = htmlString;
      for (const [key, value] of Object.entries(tooltipDict)) {
        const regex = new RegExp(`(${key})(?![^<]*>)`, 'g');
        result = result.replace(regex, `<span data-tooltip="${value}">$1</span>`);
      }
      return result;
    }

    // 텍스트 + 스타일 적용
    const textFields = [
      { field: 'name', id: 'name' },
      { field: 'cv_kr', id: 'cv-ko' },
      { field: 'cv_jp', id: 'cv-jp' },
      { field: 'race', id: 'race' },
      { field: 'gender', id: 'gender' },
      { field: 'blood', id: 'blood' },
      { field: 'birthday', id: 'birthday' },
      { field: 'age', id: 'age' },
      { field: 'height', id: 'height' },
      { field: 'weight', id: 'weight' },
      { field: 'star', id: 'star' },
      { field: 'like', id: 'like' },
      { field: 'hate', id: 'hate' },
      { field: 'skill_name', id: 'skill_name' },
      { field: 'skill_info', id: 'skill_info' },
      { field: 'skill_info2', id: 'skill_info2' }
    ];

    textFields.forEach(({ field, id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      let value = Array.isArray(mergedData[field])
        ? mergedData[field].join(', ')
        : mergedData[field] || '-';

      // skill_info2는 툴팁 처리
      if (field === 'skill_info2') {
        value = applyTooltip(value, tooltipData.tooltip_data);
      }

      if (typeof value === 'string' && value.includes('<span')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }

      const styleField = `${field}_style`;
      if (mergedData[styleField]) {
        const styleObj = mergedData[styleField];
        for (const [key, val] of Object.entries(styleObj)) {
          el.style[key] = val;
        }
      }
    });

    // 스킬 이미지
    const skillImg = document.getElementById('image-skill');
    skillImg.src = character['image-skill'] ? '../' + character['image-skill'] : '';

    // 스킬1 이름
    const skill_name1 = document.getElementById('skill_name');
    const descText = (skillInfo.skill_name || '-').replace(/\n/g, '<br>');
    skill_name1.innerHTML = descText;

    // 스킬1 적용대상
    const skill_infol = document.getElementById('skill_info');
    skill_infol.innerHTML = skillInfo.skill_info || '-';

    // 스킬1 설명 (툴팁 포함)
    const skill_info2 = document.getElementById('skill_info2');
    let info2Html = skillInfo.skill_info2 || '-';
    info2Html = applyTooltip(info2Html, tooltipData.tooltip_data);
    skill_info2.innerHTML = info2Html;

    // 툴팁 마우스 이벤트
    document.addEventListener('mouseover', e => {
  const target = e.target.closest('[data-tooltip]');
  if (!target) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip-box';
  tooltip.innerHTML = target.getAttribute('data-tooltip');
  document.body.appendChild(tooltip);

  const offsetX = 12;
  const offsetY = 12;

  // 마우스 움직임에 따라 툴팁 위치 변경
  function moveTooltip(ev) {
    tooltip.style.left = `${ev.clientX + offsetX}px`;
    tooltip.style.top = `${ev.clientY + offsetY}px`;
    tooltip.style.position = 'fixed'; // 꼭 fixed로 설정!
  }

  moveTooltip(e); // 초기 위치
  target.addEventListener('mousemove', moveTooltip);

  // 마우스 나가면 툴팁 삭제
  target.addEventListener('mouseleave', () => {
    tooltip.remove();
    target.removeEventListener('mousemove', moveTooltip);
  }, { once: true });
});

  } else {
    document.getElementById('character-info').innerHTML = '<p>캐릭터 정보를 찾을 수 없습니다.</p>';
  }
});