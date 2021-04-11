(() => {
    
    
    let yOffset = 0;//window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0;//현재 스크롤 위치 yOffset    보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된 (눈앞에 보고있는 ) 씬(scroll-section) 
    let enterNewScene = false; //새로운 scene이 시작된 순간 true

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas: document.querySelector('#video-canvas-0'),
                context:document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount:780,
                imageSequence: [0, 779],
                canvas_opcacity:[1, 0, { start: 0.9, end:1 }],
                messageA_opacity_in: [0, 1, { start: 0.16, end: 0.25 }],
                messageB_opacity_in: [0, 1, { start: 0.35, end: 0.45 }],
                messageC_opacity_in: [0, 1, { start: 0.55, end: 0.65 }],
                messageD_opacity_in: [0, 1, { start: 0.75, end: 0.85 }],
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.25 }],
                messageB_translateY_in: [20, 0, { start: 0.35, end: 0.45 }],
                messageC_translateY_in: [20, 0, { start: 0.55, end: 0.65 }],
                messageD_translateY_in: [20, 0, { start: 0.75, end: 0.85 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.5, end: 0.55 }],
                messageC_opacity_out: [1, 0, { start: 0.7, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.9, end: 0.95 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -20, { start: 0.5, end: 0.55 }],
                messageC_translateY_out: [0, -20, { start: 0.7, end: 0.75 }],
                messageD_translateY_out: [0, -20, { start: 0.9, end: 0.95 }]
            },
        },
        {
            // 1
            type: 'normal',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 .description')
            }
        },
        {
            // 2
            type: 'sticky',
            // heightNum: 2,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                canvasCaption: document.querySelector('.canvas-caption')
            },
            values: {
    
            }
        }
    ];
    
    
    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
			imgElem = new Image();
			imgElem.src = `./video/mov${2000 + i}.jpg`;
			sceneInfo[0].objs.videoImages.push(imgElem);

        }
    
    }
    setCanvasImages();
     
    function checkMenu(){
        if (yOffset > 44) {
            document.body.classList.add('local-nav-sticky');
        } else {
            document.body.classList.remove('local-nav-sticky');
        }
    };

    function setLayout(){
        //각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++ ){
            if (sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            }else if(sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;  
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;

        }
        
        //currentscene 자동으로 세팅
        yOffset = window.pageYOffset; 
        
        let totalScrollHeight =0; 
        for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        } 
       document.body.setAttribute('id', `show-scene-${currentScene}`) ; 

       const heightRatio = window.innerHeight / 1080;
       sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
       
    }
    
    function calcValues(values, currentYOffset){
        let rv;
        //현재 씬(스크롤 섹션)에서 스크롤 된 범위를 비율로 구하기 
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
         
        if (values.length === 3){
            // start~end 사이의 애니메이션 시간
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd ) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
             } else if (currentYOffset < partScrollStart) {
                 rv = values[0];
             } else if (currentYOffset > partScrollEnd ) {
                 rv = values[1];
             }

        } else {
        rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
         return rv;
    }
    
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
    
        switch (currentScene) {
            case 0:
                // console.log('0 play');
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opcacity, currentYOffset);
               
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
    
                break;
        }
    }
    
    
    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++){
           prevScrollHeight += sceneInfo[i].scrollHeight;
       } 
        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`); 

            }
        if (yOffset < prevScrollHeight){
            enterNewScene = true;
            if (currentScene === 0)return;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`); 

        }
        if (enterNewScene) return;

        playAnimation();
    }

        




    window.addEventListener('scroll',()=>{
        yOffset = window.pageYOffset;
        scrollLoop();
        checkMenu();
    });
    
//    window.addEventListener('DOMContentLoaded',setLayout);
    window.addEventListener('load', () => {
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    });
    window.addEventListener('resize',setLayout);




// 범위 랜덤 함수(소수점 2자리까지)
function random(min, max) {
    // `.toFixed()`를 통해 반환된 문자 데이터를,
    // `parseFloat()`을 통해 소수점을 가지는 숫자 데이터로 변환
    return parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }

function  floatingObject(selector, delay, size) {
 // gsap.to(요소, 지속시간 ,옵션);
 gsap.to(
     selector, //선택자
     random(1.5, 2.5), //애니메이션 동작시간
     { //옵션
     y: size,
     repeat: -1,
     yoyo: true,
     ease: Power1.easeInOut,
     delay: random(0, delay),
 });
}

floatingObject('.floating1',1,10);
floatingObject('.floating2',5,15);




//Initialize Swiper
  
var swiper = new Swiper('.swiper-container', {
    spaceBetween: 30,
    loop:true,
    centeredSlides: true,
    // autoplay: {
    // delay: 3000,
    // disableOnInteraction: false,
    //  },
     scrollbar: {
        el: '.swiper-scrollbar',
        hide: false,
      },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      },
    });

})();