function saveGameState(){localStorageTest()&&localStorage.setItem("info",JSON.stringify(GAME))}function checkSessionJsonState(e,t){return 2===parseInt(sessionStorage.getItem("JSONINCURRENTSESSION"))?e:t}function bindListeners(e,t,a){[].forEach.call(e,function(e,r,s){e.addEventListener(t,function(t){a(t,e)})})}function getRandomInt(e,t){return Math.floor(Math.random()*(t+1-e))+e}function localStorageTest(){var e="test";try{return localStorage.setItem(e,e),localStorage.removeItem(e),!0}catch(t){return!1}}function cardType(e){var t=e.slice(e.length-1,e.length),a=e,r={text:"","class":""},s=["+","#",";"],n=!1;switch(s.every(function(e,a,r){return e===t?(n=!0,!1):!0}),n&&(a=a.slice(0,e.length-1)),t){case"+":var o=GAME.currentPlayer.gender,l=0;"f"===o?o="M":"m"===o&&(o="F"),l=getRandomInt(0,GAME["players"+o].length-1),GAME.targetPlayer=GAME["players"+o][l],a+=" "+GAME.targetPlayer.name,r.text=a,r["class"]="";break;case"#":r.text=a+" (Не читайте вслух и помните что вы не должны выдавать содержимое карточки)",r["class"]="gray";break;case";":r.text=a+" (Коллективное действие)",r["class"]="mass";break;default:r.text=a,r["class"]=""}return r}function gameInit(e){saveGameState(),updateMainPlayersCloud(),"restart"!==e&&updateAllTruthActions(),nextPlayer(),updateModals(),GAME.game=!0}function getTruthOrAction(e){var t="",a=0,r=null;r=getRandomInt(a,GAME[e].length-1),t=GAME[e][r],GAME[e].splice(r,1),saveGameState(),"truth"===e&&(addStreak(e),0===GAME.truth.length&&updateTruth()),"actions"===e&&(addStreak(e),0===GAME.actions.length&&updateAction());var s=cardType(t);showModal(s)}function addStreak(e){[].every.call(GAME.players,function(t,a,r){return t.isCurrentPlayer?("truth"===e?(t.truthStreak+=1,t.actionsStreak=0):"actions"===e&&(t.actionsStreak+=1,t.truthStreak=0),!1):!0})}function getCheckedStreak(){var e={},t=2,a=0,r=0;switch(GAME.players.every(function(e,t,s){return e.isCurrentPlayer?(a=e.truthStreak,r=e.actionsStreak,!1):!0}),t){case a:e={truth:!1,actions:!0};break;case r:e={truth:!0,actions:!1};break;default:e={truth:!0,actions:!0}}return e}function nextPlayer(){var e=!0,t="",a=document.querySelector("[data-picked-player]");GAME.players.every(function(a,r,s){return a.isCurrentPlayer===!0?(GAME.players[r].isCurrentPlayer=!1,e=!1,GAME.players[r+1]?(GAME.players[r+1].isCurrentPlayer=!0,GAME.currentPlayer=GAME.players[r+1],t=GAME.currentPlayer.name):(GAME.players[0].isCurrentPlayer=!0,GAME.currentPlayer=GAME.players[0],t=GAME.currentPlayer.name),!1):!0}),e&&(GAME.players[0].isCurrentPlayer=!0,GAME.currentPlayer=GAME.players[0],t=GAME.players[0].name),a.innerHTML=t+" "}function gameStartLogic(){var e=document.querySelector("[data-gamestart-playerInput]"),t=document.querySelector("[data-gamestart-playerAdd]"),a=document.querySelectorAll("[data-gamestart-genderRadio]"),r=null,s=document.querySelector("[data-gamestart-start]");bindListeners(a,"change",function(e,t){t.checked&&(r=t.value)}),t.addEventListener("mousedown",function(t){e.value.length>=2&&null!==r&&(gameStartPlayerAdd(e.value,r,e),e.value=""),SavePlayers(document.querySelectorAll("[data-gamestart-player]"),"data-gameStart-player-gender")}),s.addEventListener("mousedown",function(e){1===GAME.jsonState&&preloader("show"),2===GAME.jsonState&&(GAME.gameState=1,gameInit())})}function SavePlayers(e,t){var a=e,r="",s="",n={constructor:function(e,t){return this.name=e,this.gender=t,this.actionsStreak=0,this.truthStreak=0,this.isCurrentPlayer=!1,this}};GAME.players=[],GAME.playersF=[],GAME.playersM=[],[].forEach.call(a,function(e,a,o){r=e.innerText||e.textContent,s=e.getAttribute(t),player=Object.create(n).constructor(r,s),GAME.players.push(player),GAME["players"+player.gender.toUpperCase()].push(player)})}function gameStartCheckPlayerExist(e){var t=!1;return t=GAME.players.some(function(t,a,r){return t.name===e.value?!0:void 0})}function gameStartClose(){var e=document.querySelector("[data-gamestart]"),t=null,a=document.querySelectorAll("[data-gamestart-modal]");e.classList.add("hidden"),a[a.length-1].classList.add("hidden"),t=setTimeout(function(){e.classList.add("visibility")},600)}function updateTruth(){GAME.truth=[],GAME.rubrics.forEach(function(e,t,a){for(var r in GAME.json)if(r===e)for(var s in GAME.json[r]["true"])GAME.truth.push(GAME.json[r]["true"][s])})}function updateAction(){GAME.actions=[],GAME.rubrics.forEach(function(e,t,a){for(var r in GAME.json)if(r===e)for(var s in GAME.json[r].action)GAME.actions.push(GAME.json[r].action[s])})}function updateAllTruthActions(){updateTruth(),updateAction()}function getJson(){var e="assets/response.json";if(!navigator.onLine)return GAME.json=JSON.parse(localStorage.getItem("json")),void gameInit();var t=new XMLHttpRequest;t.open("GET",e,!0),GAME.jsonState=1,sessionStorage.setItem("JSONINCURRENTSESSION",1),t.onload=function(){if(t.status>=200&&t.status<400){var e=JSON.parse(t.responseText);GAME.json=e,GAME.jsonState=2,localStorageTest()&&localStorage.setItem("json",JSON.stringify(e)),sessionStorage.setItem("JSONINCURRENTSESSION",2),"visible"===preloader("getState")&&2===GAME.jsonState&&(preloader("hide"),gameInit()),GAME.jsonState=2,GAME.gameState=1}},t.onerror=function(){},t.send()}function showModal(e){var t=document.querySelector("[data-game-overlay]"),a=document.querySelector("[data-game-modal]"),r=a.querySelector("[data-game-modal-content]");r.innerHTML=e.text,t.classList.remove("hidden"),t.classList.add("active"),e["class"].length>=1&&a.classList.add(e["class"]);setTimeout(function(){a.classList.remove("hidden"),a.classList.add("active")},600)}function closeModal(){var e=document.querySelector("[data-game-overlay]"),t=document.querySelector("[data-game-modal]"),a=document.querySelector('[data-showmodal-button="truth"]'),r=document.querySelector('[data-showmodal-button="actions"]');t.classList.remove("active"),e.classList.remove("active"),nextPlayer();var s=getCheckedStreak();s.truth===!1?(a.classList.add("disabled"),a.setAttribute("data-disabled","true")):(a.classList.remove("disabled"),a.removeAttribute("data-disabled")),s.actions===!1?(r.classList.add("disabled"),r.setAttribute("data-disabled","true")):(r.classList.remove("disabled"),r.removeAttribute("data-disabled"));setTimeout(function(){t.classList.add("hidden"),t.classList.remove("gray","mass"),e.classList.add("hidden")},600)}function updateMainPlayersCloud(){var e=document.querySelector("[data-game-players-container]"),t="",a=document.querySelectorAll("[data-game-player]");a&&[].forEach.call(a,function(e,t,a){e.remove()}),GAME.players.forEach(function(e,a,r){t+=TEMPLATES.player(e.gender,e.name)}),e.insertAdjacentHTML("afterbegin",t)}function gameStartView(){var e=(document.querySelectorAll("[data-gamestart-modal]"),document.querySelectorAll("[data-gamestart-nextmodal]")),t=(document.querySelectorAll("[data-gamestart]"),document.querySelectorAll("[data-gamestart-prevmodal]")),a=document.querySelector("[data-gamestart-start]"),r=null,s=null,n=null;bindListeners(e,"mousedown",function(e,t){n=t.closest("[data-gamestart-modal]"),r=n.nextSibling,n.classList.add("hidden"),r.classList.add("active")}),bindListeners(t,"mousedown",function(e,t){n=t.closest("[data-gamestart-modal]"),s=n.previousSibling,n.classList.remove("active"),s.classList.remove("hidden")}),a.addEventListener("mousedown",function(e){gameStartClose()})}function gameStartPlayerAdd(e,t,a){var r=document.querySelector("[data-gamestart-playerContainer]");gameStartCheckPlayerExist(a)||(r.insertAdjacentHTML("beforeend",TEMPLATES.gameStartCreatePlayer(t,e)),gameStartPlayerDeleteBind(),document.querySelectorAll("[data-gamestart-player]").length>=2?r.closest("[data-gamestart-modal]").querySelector("[data-newplayer-modal-button]").removeAttribute("data-disabled"):r.closest("[data-gamestart-modal]").querySelector("[data-newplayer-modal-button]").setAttribute("data-disabled",""))}function gameStartPlayerDelete(e){var t=document.querySelector("[data-gamestart-playerContainer]"),a=e.innerText||e.textContent,r=e.getAttribute("data-gamestart-player-gender");GAME.players=GAME.players.filter(function(e,t,r){return e.name!==a}),GAME["players"+r.toUpperCase()]=GAME["players"+r.toUpperCase()].filter(function(e,t,r){return e.name!==a}),e.remove(),document.querySelectorAll("[data-gamestart-player]").length>=2?t.closest("[data-gamestart-modal]").querySelector("[data-newplayer-modal-button]").removeAttribute("data-disabled"):t.closest("[data-gamestart-modal]").querySelector("[data-newplayer-modal-button]").setAttribute("data-disabled","")}function gameStartPlayerDeleteBind(){var e=document.querySelectorAll("[data-gamestart-player]");bindListeners(e,"click",function(e,t){gameStartPlayerDelete(t.closest("[data-gamestart-player]"))})}function gameStartRubricSelect(){function e(e){var t=!1;return[].some.call(e,function(e,a,r){return e.checked?(t=!0,!1):void 0}),t?!0:!1}var t=document.querySelectorAll("[data-gamestart-rubric]");bindListeners(t,"change",function(a,r){GAME.rubrics=[],e(t)?r.closest("[data-gamestart-modal]").querySelector("[data-rubricselect-modal-button]").removeAttribute("data-disabled"):r.closest("[data-gamestart-modal]").querySelector("[data-rubricselect-modal-button]").setAttribute("data-disabled",""),[].forEach.call(t,function(e,t,a){e.checked&&GAME.rubrics.push(e.value)})})}function resetModals(){var e=localStorage.getItem("gamestartHTML");document.querySelector("[data-gamestart]").innerHTML=e,gameStartView(),gameStartLogic(),gameStartRubricSelect()}function resetGAME(){GAME={players:[],playersM:[],playersF:[],currentPlayer:{},targetPlayer:{},rubrics:[],actions:[],truth:[],json:checkSessionJsonState(JSON.parse(localStorage.getItem("json")),{}),jsonState:checkSessionJsonState(2,0),gameState:0}}function updateModals(){document.querySelector("[data-newPlayer-modal]"),document.querySelector("[data-rubricSelect-modal]"),document.querySelector("[data-rules-modal]");[].forEach.call(document.querySelectorAll("[data-gamestart-modal]"),function(e,t,a){e.querySelector("[data-gamestart-prevmodal]")&&(e.querySelector("[data-gamestart-prevmodal]").remove(),e.querySelector("[data-gamestart-nextmodal]")&&e.querySelector("[data-gamestart-nextmodal]").classList.remove("next-back")),e.querySelector("[data-gamestart-nextmodal]")&&(e.querySelector("[data-gamestart-nextmodal]").innerHTML="Ок")}),[].forEach.call(document.querySelectorAll("[data-gamestart-nextmodal]"),function(e,t,a){e.removeAttribute("data-gamestart-nextmodal"),e.setAttribute("data-close-default-modal","")}),bindListeners(document.querySelectorAll("[data-close-default-modal]"),"mousedown",function(e,t){null!==t.getAttribute("data-newplayer-modal-button")&&void 0!==t.getAttribute("data-newplayer-modal-button")&&(updateMainPlayersCloud(),saveGameState()),null!==t.getAttribute("data-rubricselect-modal-button")&&void 0!==t.getAttribute("data-rubricselect-modal-button")&&(updateAllTruthActions(),saveGameState()),t.closest("[data-gamestart-modal]").classList.add("hidden");var a=document.querySelector("[data-gamestart]"),r=null;a.classList.add("hidden"),r=setTimeout(function(){a.classList.add("visibility")},600)}),bindListeners(document.querySelectorAll("[data-show-default-modal]"),"click",function(e,t){e.preventDefault();var a=t.getAttribute("data-show-default-modal"),r=document.querySelector("["+a+"]"),s=document.querySelector("[data-gamestart]"),n=null;s.classList.remove("visibility"),s.classList.remove("hidden"),n=setTimeout(function(){r.classList.remove("hidden"),r.classList.add("active")},100)})}function preloader(e){var t={selector:document.querySelector(".preloader"),visiblityClass:"visibility",opacityClass:"opacity",transitionTime:600};switch(e){case"hide":t.selector.classList.add(t.opacityClass);{setTimeout(function(){t.selector.classList.add(t.visiblityClass)},t.transitionTime)}break;case"show":t.selector.classList.remove(t.visiblityClass),t.selector.classList.remove(t.opacityClass);break;case"getState":return t.selector.classList.contains(t.visiblityClass)?"hidden":"visible"}}!function(){var e=document.querySelectorAll("[data-disabled]");bindListeners(e,"mousedown",function(e){e.preventDefault()})}(),function(e,t){e.matches=e.matches||e[t+"MatchesSelector"],e.closest=e.closest||function(e){for(var t=this;t;){if(t.matches(e))return t;t=t.parentElement}return null}}(Element.prototype,(this.getComputedStyle&&[].join.call(getComputedStyle(document.documentElement,"")).match(/-(moz|ms|webkit)-/)||[])[1]),Element.prototype.remove=function(){this.parentElement.removeChild(this)},NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var e=0,t=this.length;t>e;e++)this[e]&&this[e].parentElement&&this[e].parentElement.removeChild(this[e])};var GAME={players:[],playersM:[],playersF:[],currentPlayer:{},targetPlayer:{},rubrics:[],actions:[],truth:[],json:{},jsonState:0,gameState:0};sessionStorage.setItem("JSONINCURRENTSESSION",0),function(){var e=document.querySelectorAll("[data-showmodal-button]");closePopupButton=document.querySelector("[data-game-modalclose-button]"),bindListeners(e,"mousedown",function(e,t){var a=t.getAttribute("data-showmodal-button");getTruthOrAction(a)}),closePopupButton.addEventListener("mousedown",function(e){closeModal()})}(),function(){gameStartLogic()}();var TEMPLATES={gameStartCreatePlayer:function(e,t){var a="m"===e?"":"fe",r='<span class="game-start_player game-start_player--'+a+'male" data-gameStart-player-gender="'+e+'" data-gamestart-player>';return r+=t+'<span class="game-start_player-remove" data-gamestart-player-remove></span></span>'},player:function(e,t){var a="m"===e?"":"fe",r="m"===e?"business":"woman",s='<div class="player_item player_item--'+a+'male" data-game-player><div class="player_item_avatar player_item_avatar--'+a+'male"><svg width="22px" height="22px"><use xlink:href="#'+r+'"></use></svg></div><div class="player_item_name">'+t+"</div></div>";return s}};!function(){gameStartView()}(),function(){gameStartRubricSelect()}(),function(){if(localStorage.getItem("info")){var e=JSON.parse(localStorage.getItem("info")),t=document.querySelector("[data-gamestart]"),a=document.querySelector("[data-game-restart-wrap]"),r=document.querySelector("[data-game-continue]");t.classList.add("visibility"),a.classList.add("active"),r.addEventListener("mousedown",function(t){GAME=e,gameInit("restart"),a.classList.remove("active")})}}(),function(){var e=document.querySelectorAll("[data-game-restart]"),t=document.querySelector("[data-gamestart]"),a=document.querySelectorAll("[data-gamestart-modal]"),r=document.querySelector("[data-game-restart-wrap]");bindListeners(e,"mousedown",function(e,s){localStorage.removeItem("info");var n=s.getAttribute("data-game-restart");(n="resetModals")&&resetModals(),resetGAME(),t.classList.remove("visibility","hidden"),r.classList.remove("active"),[].forEach.call(a,function(e,t,a){e.classList.remove("active","hidden"),0===t&&e.classList.add("active")}),0===parseInt(sessionStorage.getItem("JSONINCURRENTSESSION"))&&navigator.onLine&&getJson()})}(),window.onload=function(e){preloader("hide");var t;t=document.querySelector("[data-gamestart]").innerHTML,localStorage.setItem("gamestartHTML",t),!localStorage.getItem("info")&&navigator.onLine&&getJson(),loadYM()},function e(){var t=document.querySelector("[data-sidebar-toggle]"),e=document.querySelector(".sidebar"),a=document.querySelector(".header"),r=document.querySelectorAll(".sidebar_link");t.addEventListener("mousedown",function(r){t.classList.contains("active")?(t.classList.remove("active"),e.classList.remove("active"),a.classList.remove("active")):(t.classList.add("active"),e.classList.add("active"),a.classList.add("active"))}),bindListeners(r,"click",function(r,s){t.classList.contains("active")?(t.classList.remove("active"),e.classList.remove("active"),a.classList.remove("active")):(t.classList.add("active"),e.classList.add("active"),a.classList.add("active"))})}();