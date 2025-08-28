function connectWallet() {
    const walletButton = document.querySelector('.connect-wallet');
    walletButton.textContent = 'photographer.eth';
}
function openTutorial() {
    window.open('https://farcaster.xyz/nimaleophotos.eth', '_blank');
}
function openPage(pageType) {
    document.querySelectorAll('.page-screen').forEach(page => page.classList.remove('show'));
    const page = document.getElementById(pageType + 'Page');
    if (page) page.classList.add('show');
}
function closePage() {
    document.querySelectorAll('.page-screen').forEach(page => page.classList.remove('show'));
}
function toggleSetting(toggle) { toggle.classList.toggle('active'); }
function toggleTheme(toggle) {
    document.body.classList.toggle('light-theme');
    const svg = toggle.querySelector('svg');
    if(document.body.classList.contains('light-theme')){
        svg.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
        svg.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    }
}
function switchTab(tabName){
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function generateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const usernames = [/* all 100 usernames from your JS */];
    let html = '';
    for (let i = 1; i <= 100; i++) {
        const username = usernames[i-1]||`photographer${i}.eth`;
        const basePoints = 20000;
        const points = basePoints-(i*150)+Math.floor(Math.random()*100);
        let rankClass='', itemClass='', usernameClass='';
        if(i===1){rankClass='first';itemClass='first';usernameClass='first';}
        else if(i===2){rankClass='second';itemClass='second';usernameClass='second';}
        else if(i===3){rankClass='third';itemClass='third';usernameClass='third';}
        html += `<div class="leaderboard-item ${itemClass}">
                    <div class="rank-sticker ${rankClass}"><span>${i}</span></div>
                    <div class="user-info"><div class="username ${usernameClass}">${username}</div>
                    <div class="points">${points.toLocaleString()} points</div></div></div>`;
    }
    leaderboardList.innerHTML = html;
}

const slogans = [
    "Capture the moment with $LENS!",
    "Behind every $LENS lies a new perspective!",
    "Every $LENS has a story to tell!",
    "A $LENS turns moments into memories!",
    "See the unseen through your $LENS!",
    "Life is more vivid through a $LENS!",
    "A $LENS captures what words cannot!"
];
let currentSloganIndex = 0;
function updateSlogan() {
    const sloganElement = document.getElementById('dynamicSlogan');
    if(sloganElement){
        sloganElement.innerHTML='';
        currentSloganIndex=(currentSloganIndex+1)%slogans.length;
        slogans[currentSloganIndex].split(' ').forEach((word,index)=>{
            const wordSpan=document.createElement('span');
            wordSpan.className='slogan-word';
            wordSpan.textContent=word;
            wordSpan.style.animationDelay=`${index*0.1}s`;
            sloganElement.appendChild(wordSpan);
        });
    }
}

document.addEventListener('DOMContentLoaded',function(){
    generateLeaderboard();
    updateSlogan();
    setInterval(updateSlogan,20000);
});
