const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf('mobile') > -1 || userAgent.indexOf('android') > -1 || userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {

  window.addEventListener('DOMContentLoaded', function () {
    var windowsElements = document.getElementsByClassName("windows");
    var macMenuBarElements = document.getElementsByClassName("mac-menubar");

    for (var i = 0; i < windowsElements.length; i++) {
      windowsElements[i].style.display = "none";
    }

    for (var i = 0; i < macMenuBarElements.length; i++) {
      macMenuBarElements[i].style.display = "none";
    }
  });
}
else {
  const $card = document.querySelector('.card');
  let bounds;

  function rotateToMouse(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2
    }
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    $card.style.transform = `
    scale3d(1.07, 1.07, 1.07)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `;
  }

  $card.addEventListener('mouseenter', () => {
    bounds = $card.getBoundingClientRect();
    document.addEventListener('mousemove', rotateToMouse);
  });

  $card.addEventListener('mouseleave', () => {
    document.removeEventListener('mousemove', rotateToMouse);
    $card.style.transform = '';
    $card.style.background = '';
  });

  window.addEventListener('resize', function () {
    let scale = Math.min(window.innerWidth / document.documentElement.clientWidth, window.innerHeight / document.documentElement.clientHeight);
    document.body.style.transform = `scale(${scale})`;
  });


  //LOL DATA
  const dataUrl = 'js/data';
  const dirUrl = `${dataUrl}/data.json`;
  
  fetch(dirUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const summonerName = data.name;
      const level = data.level;
      const rank = data.rank;
      const tier = data.tier;
      const lp = data.lp;
  
      const playerIcon = document.getElementById('player-icon');
      playerIcon.src = `${dataUrl}/icon.png`;
  
      const tierIcon = document.getElementById('tier-icon');
      tierIcon.src = `${dataUrl}/tier.png`;
  
      const playerLevel = document.getElementById('player-level');
      playerLevel.textContent = `${level}`;
  
      const playerName = document.getElementById('player-name');
      playerName.textContent = summonerName;
  
      const rankTierElement = document.getElementById('tier-rank');
      rankTierElement.textContent = `${tier} ${rank}`;
  
      const rankLPElement = document.getElementById('rank-lp');
      rankLPElement.textContent = `${lp} LP`;
    })
    .catch(error => {
      console.error('Error:', error);
    });


  //HIDE LOL WINDOW
  const lolToggleBtn = document.querySelector('.lol-window-toggle');
  const lolWindow = document.querySelector('.lol');

  lolToggleBtn.addEventListener('click', function () {
    if (lolWindow.style.opacity === '1') {
      lolWindow.style.opacity = '0';
      //aspetta 0.5 secondi prima di modificare il zIndex
      setTimeout(function () {
        lolWindow.style.zIndex = '0';
      }, 500);
    } else {
      lolWindow.style.opacity = '1';
      lolWindow.style.zIndex = '11';
    }
  });

  //MOVE LOL WINDOW
  let isDragging = false;
  let mouseOffset = { x: 0, y: 0 };

  const windowBar = lolWindow.querySelector('.lol .window');

  windowBar.addEventListener('mousedown', function (event) {
    isDragging = true;

    // Calcola l'offset del mouse rispetto all'inizio della finestra
    mouseOffset.x = event.clientX - lolWindow.offsetLeft;
    mouseOffset.y = event.clientY - lolWindow.offsetTop;

    // Disabilita la selezione del testo durante il trascinamento della finestra
    lolWindow.style.userSelect = 'none';

    // Aggiungi il listener dell'evento mousemove sulla finestra
    lolWindow.addEventListener('mousemove', onMouseMove);
  });

  function onMouseMove(event) {
    if (isDragging) {
      // Imposta la posizione della finestra in base alla posizione del mouse
      lolWindow.style.left = (event.clientX - mouseOffset.x) + 'px';
      lolWindow.style.top = (event.clientY - mouseOffset.y) + 'px';

      // Utilizza requestAnimationFrame per ridurre il ritardo dell'animazione
      window.requestAnimationFrame(function () {
        lolWindow.style.left = (event.clientX - mouseOffset.x) + 'px';
        lolWindow.style.top = (event.clientY - mouseOffset.y) + 'px';
      });
    }
  }

  function onMouseUp(event) {
    // Rimuovi i listener degli eventi mousemove e mouseup dalla finestra
    lolWindow.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    // Abilita di nuovo la selezione del testo dopo il trascinamento della finestra
    lolWindow.style.userSelect = 'auto';
  }

  lolWindow.addEventListener('mouseup', onMouseUp);
  lolWindow.addEventListener('mouseleave', onMouseUp);

}