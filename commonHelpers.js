import"./assets/styles-bbe4e61f.js";import{f as h,i as v}from"./assets/vendor-77e16229.js";const a=document.querySelector(".section button[data-start]"),p=document.querySelectorAll(".timer .field span.value");a.classList.add("inactive");let c;const I=new Date;let i,r,y={class:"snackbar-box",theme:"dark",timeout:3e3,title:"Please choose a date in the future",titleSize:18,position:"topRight",backgroundColor:"#FD4B3F",progressBar:!1,closeOnClick:!0,displayMode:"once",icon:"fa fa-times-circle",transitionIn:"fadeInUp",close:!1};const g={enableTime:!0,time_24hr:!0,defaultDate:new Date,minuteIncrement:1,onClose:k};h("#datetime-picker",g);function k(t){c=t[0];let e=c.getTime()-I.getTime();if(e<0){v.error(y),a.classList.add("inactive");return}e!==r&&(a.classList.remove("inactive"),r=e,D(r))}function D(t){let e=t;a.addEventListener("click",n=>{i&&clearInterval(i);let o=setInterval(()=>{let s=L(e);C({objDateData:s,timerDom:p}),e-=1e3,e<0&&(console.log("Done"),clearInterval(o))},1e3);i=o,a.classList.add("inactive")},{once:!0})}function C({objDateData:t,timerDom:e}){for(const n in t)for(let o=0;o<e.length;o++)e[o].dataset[n]===""&&e[o].textContent!==l(t[n])&&(e[o].textContent=l(t[n]))}function l(t){return`${t}`.padStart(2,"0")}function L(t){const d=Math.floor(t/864e5),u=Math.floor(t%864e5/36e5),f=Math.floor(t%864e5%36e5/6e4),m=Math.floor(t%864e5%36e5%6e4/1e3);return{days:d,hours:u,minutes:f,seconds:m}}
//# sourceMappingURL=commonHelpers.js.map
