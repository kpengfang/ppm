var bgImg = new Image();
bgImg.src = './images/bg.jpg';//背景
var hbImg = new Image();
hbImg.src = './images/b.gif';
var htImg = new Image();
htImg.src = './images/t.gif';
var hlImg = new Image();
hlImg.src = './images/l.gif';
var hrImg = new Image();
hrImg.src = './images/r.gif';
var bodyImg = new Image();
bodyImg.src = './images/body.gif';
var foodImg = new Image();
foodImg.src = './images/food.gif';

function Snake(){
	
	this.cav = document.getElementById("cav");//画图区域
	this.canvas = this.cav.getContext('2d');//绘制画布
	this.score = 0;//分数
	this.phone = 0;//0=>pc 1=>phone
	this.step = 25;//步长
	this.width = 500;//画布宽度
	this.height = 500;//画布高度
	this.stepW = this.width/this.step;
	this.stepH = this.height/this.step;
	this.snakeArr = [];//蛇身数组
	this.foodArr = [];
	this.timer = null;
	this.init = function(){
		this.phoneOrPc();
		this.draw();
		this.move();
	}
	//终端设别检测
	this.phoneOrPc = function(){
		var temp = navigator.userAgent;
		if(temp.indexOf('Windows')==-1){
			//画布填充满整个屏幕
			var w = window.innerWidth;
			var h = window.innerHeight;
			this.width = w;
			this.height = h;
			this.stepW = this.width/this.step;
			this.stepH = this.height/this.step;
			this.cav.width = this.width;
			this.cav.height = this.height;
			this.phone = 1;
		}

	}
	
	//1,绘制游戏元素
	this.draw = function(){
		//1,绘制背景
		this.canvas.drawImage(bgImg,0,0,this.width,this.height);
		//2，画蛇
		this.drawSnake();
		//3，画食物
		this.drawFood();

	}
	this.drawFood = function(){
		if(this.foodArr.length != 0){//说明有食物
			this.canvas.drawImage(foodImg,this.foodArr[0].x*this.step,this.foodArr[0].y*this.step,this.step,this.step);
			return;
		}
		//var x = Math.random();//0-1小数
		var x = Math.floor(Math.random()*this.stepW);
		var y = Math.floor(Math.random()*this.stepH);
		//this.canvas.drawImage(foodImg,x*this.step,y*this.step,this.step,this.step);
		for(var i=0;i<this.snakeArr.length;i++){
			if(this.snakeArr[i].x==x && this.snakeArr[i].y==y){
				this.drawFood();
				break;
			}
		}
		//没重合
		this.foodArr[0] = {
			x:x,
			y:y,
			img:foodImg
		}
		this.canvas.drawImage(foodImg,this.foodArr[0].x*this.step,this.foodArr[0].y*this.step,this.step,this.step);
	}
	this.drawSnake = function(){
		//初始化蛇身体
		if(this.snakeArr.length == 0 ){
			for(var i=0;i<5;i++){
				this.snakeArr[i] = {
					x:Math.floor(this.stepW/2) + i -2,
					y:Math.floor(this.stepH/2),
					img:bodyImg,
					d:'l'
				}
			}
			this.snakeArr[0].img = hlImg;//改蛇头图片
		}
		for(var i=0;i<this.snakeArr.length;i++){
			this.canvas.drawImage(this.snakeArr[i].img,
				this.snakeArr[i].x*this.step,
				this.snakeArr[i].y*this.step,
				this.step,this.step);
		}
	}
	this.keyPress = function(){
		var This = this;
		document.onkeydown = function(ev){
			var ev = ev || window.event;
			var code = ev.keyCode;
			switch(code){
				case 37:
					This.snakeArr[0].d = 'l';
					This.snakeArr[0].img = hlImg;
					break;
				case 38:
					This.snakeArr[0].d = 't';
					This.snakeArr[0].img = htImg;
					break;
				case 39:
					This.snakeArr[0].d = 'r';
					This.snakeArr[0].img = hrImg;
					break;
				case 40:
					This.snakeArr[0].d = 'b';
					This.snakeArr[0].img = hbImg;
					break;
			}
		}
	}
	
	this.touchPress = function(){
		var This = this;
		document.addEventListener('touchstart',function(ev){
			var ev = ev || window.event;
			var x = ev.changedTouches[0].clientX;
			var y = ev.changedTouches[0].clientY;
			if(This.snakeArr[0].d=='l' || This.snakeArr[0].d=='r'){
				if(y>This.snakeArr[0].y*This.step){
					This.snakeArr[0].d = 'b';
					This.snakeArr[0].img = hbImg;
				}else{
					This.snakeArr[0].d = 't';
					This.snakeArr[0].img = htImg;
				}
			}else{
				if(x>This.snakeArr[0].x*This.step){
					This.snakeArr[0].d = 'r';
					This.snakeArr[0].img = hrImg;
				}else{
					This.snakeArr[0].d = 'l';
					This.snakeArr[0].img = hlImg;
				}
			}
		})
	}
	//2,让蛇动起来
	this.move = function(){
		var This = this;
		if(this.phone){
			//触屏事件
			this.touchPress();

		}else{
			//走键盘事件

			this.keyPress();
		}
		
		
		this.timer = setInterval(function(){
			for(var i=This.snakeArr.length-1;i>0;i--){
				This.snakeArr[i].x = This.snakeArr[i-1].x;
				This.snakeArr[i].y = This.snakeArr[i-1].y;
			}
			//处理蛇头
			switch(This.snakeArr[0].d){
				case 'l':
					This.snakeArr[0].x--;
					break;
				case 'r':
					This.snakeArr[0].x++;
					break;
				case 't':
					This.snakeArr[0].y--;
					break;
				case 'b':
					This.snakeArr[0].y++;
					break;
			}
			This.draw();
			This.hit();
		},200);
		
	}
	//3,让他去死
	this.hit = function(){
		//碰到游戏边界
		if(this.snakeArr[0].x <0 || this.snakeArr[0].x*this.step>=this.width || this.snakeArr[0].y<0 || this.snakeArr[0].y*this.step>=this.height){

			this.gameOver();
		}
		//碰到自己  蛇头的x，y 和身体某一节的x ，y 完全一致
		for(var i=1;i<this.snakeArr.length;i++){
			if(this.snakeArr[0].x==this.snakeArr[i].x && this.snakeArr[0].y==this.snakeArr[i].y){
				this.gameOver();
			}
		}
		
		//碰到食物
		if(this.snakeArr[0].x==this.foodArr[0].x && this.snakeArr[0].y==this.foodArr[0].y){
			this.score++;
			this.snakeArr.push({
				x:0,
				y:0,
				img:bodyImg
			})
			this.foodArr.pop();
		}
	}
	
	//游戏结束
	this.gameOver = function(){
		//1,停到定时器
		clearInterval(this.timer);
		//2,画背景
		this.canvas.drawImage(bgImg,0,0,this.width,this.height);
		//3,写文字
		this.canvas.font = "20px 微软雅黑";
		this.canvas.fillStyle = "black";
		this.canvas.textAlign = "center";
		this.canvas.fillText("后盾贪食蛇，不作就不会死",this.width/2,this.height/3);
		
		this.canvas.font = "20px 微软雅黑";
		this.canvas.fillStyle = "red";
		this.canvas.textAlign = "center";
		this.canvas.fillText("吃掉 " + this.score +" 个",this.width/2,this.height/2);
	}
}
























