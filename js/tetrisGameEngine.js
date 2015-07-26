/*
Project Name:the engine of Tetris
Created by Jason Zheng at 19/7/2015
 */
/*
Idea:
每次左右移动或变形之后都要检测碰撞,若检测到碰撞则取消该次移动或变形操作
其中若是向下的移动出现碰撞则认为该砖块已经到底了，将产生下一个砖块
 */
function GameEngine() {
	this.bricks = []; //砖块阵列
	this.speed = 1200; //目前的速度
	this.step = 1; //目前的关卡
	this.currentBrick = ""; //目前的砖块
	this.nextBrick = ""; //下一个砖块
	this.isMoving = false; //正在左移、右移、变形？
	this.isDown = true; //正在下落？
	this.timer = ""; //定时器
	this.score = 0; //分数
	this.MaxH = 0;
	this.infoBricks = []; //下一个砖块的提示区
	this.brickCount = 0; //每20个砖块算作一关，连续降20个砖块后算是通过一关
}

GameEngine.prototype = {
	init : function () {
		var self = this;
		var bricks = "";
		//生成130个小砖块，游戏区的砖块矩阵
		for (var i = 0; i < 130; i++) {
			bricks += '<div class="block"><img src="./img/brick.png" class="bricks" id="brick' + i + '"/></div>';
		}
		//显示到界面上
		get("brickContainer").innerHTML = bricks;

		//生成提示区的砖块矩阵
		bricks = "";
		for (var i = 0; i < 16; i++) {
			bricks += '<div class="nextSB"><img src="./img/brick.png" class="bricks" id="nextSB' + i + '"/></div>';
		}
		get("nextB").innerHTML = bricks;

		//300ms后将小砖块对应的html对象取到并包装成{"item":htmlObj,"show":true/false}放到this.bricks中,
		setTimeout(function () {
			for (var i = 0; i < 130; i++) {
				var obj = {
					"item" : get("brick" + i),
					"show" : false
				};
				self.bricks.push(obj);
			}
			//再往里面添加10个，这10个构成最底下的一行，不显示，主要作用就是通过碰撞检测就能知道砖块是否到最下面一层
			for (var i = 0; i < 10; i++) {
				self.bricks.push({
					"show" : true
				});
			}
			//初始化提示区
			for (var i = 0; i < 16; i++) {
				self.infoBricks.push({
					"item" : get("nextSB" + i),
					"show" : false
				});
			}
		}, 300);
		//定义键盘监听方法
		//右：100,左：97，下:115,空格：32
		function keyDownHandler(e) {
			var ee = e || window.event;
			var keynum = ee.keyCode || ee.which || ee.charCode;
			if (keynum == 97 || keynum == 100|| keynum == 115 || keynum == 32) {
				if (ee.preventDefault) {
					ee.preventDefault();
				} else {
					ee.returnValue = false;
				}
				if (!self.isDown) { //如果正在下落，则忽略本次操作
					self.isMoving = true;
					switch (keynum) {
					case 100:
						self.moveRight();
						break;
					case 97:
						self.moveLeft();
						break;
					case 32:
						self.change();
						break;
					case 115:
						self.moveDown();
						break;
					default: ;
						break;
					}
				}
				if (ee.stopPropagation) {
					ee.stopPropagation();
				} else {
					ee.cancelBubble = true;
				}
			}
		}
		document.onkeypress = keyDownHandler; //注册键盘敲击事件
	},
	moveLeft : function () {
		var self = this;
		self.currentBrick.moveLeft(); //当前砖块左移
		if (self.checkClash()) { //检查是否产生碰撞
			self.isMoving = false; //如果有，那么无视该次操作
		} else {
			self.show(); //否则显示新的位置
		}
	},
	moveRight : function () {
		var self = this;
		self.currentBrick.moveRight();
		if (self.checkClash()) {
			self.isMoving = false;
		} else {
			self.show();
		}
	},
	moveDown : function () {
		var self = this;
		self.currentBrick.moveDown();
		if (self.checkClash()) { //一般向下这一操作产生碰撞的话说明表明极有可能已经有某一行成功填满
			console.log("clash");
			self.currentBrick.subBricks.sort(compareY); //按Y升序将当前砖块里的小砖块排序
			if (self.MaxH < self.currentBrick.subBricks[3].y) { //更新当前最高位置，这里有问题
				self.MaxH = self.currentBrick.subBricks[3].y
			}
			self.checkOk(); //检查是否有填满的行
			if (self.MaxH > 12) { //检查是否已经到顶
				self.gameOver(); //到顶则游戏结束
				self.show();
			} else {
				//没有的话则继续生成另一个砖块
				self.newBrick();
				self.isMoving = false;
			}
			return;
		}
		self.show();
	},
	change : function () { //砖块变形
		var self = this;
		self.currentBrick.change();
		if (self.checkClash()) {
			self.isMoving = false;
		} else {
			self.show();
		}
	},
	show : function () { //显示砖块新的位置
		var self = this;
		var index;
		//这里可以优化一下，计算哪些需要显示，哪些需要隐藏，不过这样也没有多大的性能损耗。计算的话可以采用计算字符串最长公共子序列的方法（动态规划）
		//公共子序列是已经显示了的，但是不需要隐藏的
		//计算旧的位置的小砖块对应在self.bricks的位置
		for (var i = 0; i < self.currentBrick.old.length; i++) {
			index = self.currentBrick.old[i].x - 1 + (13 - self.currentBrick.old[i].y) * 10;
			if (index < 0 || index > 130)
				continue;
			self.bricks[index].item["style"]["display"] = "none";
			self.bricks[index].show = false;
		}
		//计算新的位置的小砖块对应在self.bricks的位置
		for (var i = 0; i < 4; i++) {
			index = self.currentBrick.subBricks[i].x - 1 + (13 - self.currentBrick.subBricks[i].y) * 10;
			if (index < 0 || index > 130)
				continue;
			self.bricks[index].item["style"]["display"] = "block";
			self.bricks[index].show = true;
		}
		self.isMoving = false;
	},
	showNext : function () { //提示下一个砖块
		var self = this;
		if (self.nextBrick) {
			var temp = [];
			for (var i = 0; i < self.nextBrick.subBricks.length; i++) {
				var obj = {
					"x" : self.nextBrick.subBricks[i].x,
					"y" : self.nextBrick.subBricks[i].y
				};
				temp.push(obj);
			}
			//使砖块坐标适应提示框
			var stepX,
			stepY;
			temp.sort(compareY);
			stepY = temp[0].y - 1;
			temp.sort(compareX);
			stepX = temp[0].x - 1;
			temp.forEach(function (item, index, arr) {
				arr[index].y -= stepY;
				arr[index].x -= stepX;
			});
			//隐藏之前的砖块
			for (var i = 0; i < self.infoBricks.length; i++) {
				if (self.infoBricks[i].show) {
					self.infoBricks[i].show = false;
					self.infoBricks[i].item["style"]["display"] = "none";
				}
			}
			//显示现在的砖块
			var index = 0;
			for (var i = 0; i < temp.length; i++) {
				index = temp[i].x - 1 + (4 - temp[i].y) * 4;
				self.infoBricks[index].show = true;
				self.infoBricks[index].item["style"]["display"] = "block";
			}
		}
	},
	checkOk : function () { //检查某一行是否已经满了，如果已满则消去改行，并且将上面的砖块下移，并为玩家加分
		var self = this;
		var result = false;
		var tar = [];
		//选出需要检查的行，有可能一个大砖块的有几个小砖块处于同一行，除去重复的
		for (var i = 0; i < self.currentBrick.subBricks.length; i++) {
			result = false;
			for (var j = 0; j < tar.length; j++) {
				if (tar[j] === self.currentBrick.subBricks[i].y) {
					result = true;
					break;
				}
			}
			if (!result) {
				tar.push(self.currentBrick.subBricks[i].y);
			}
		}
		//tar 中是将要检测的行
		result = true;
		var temp = [];
		var index = 0;
		//检查行是否已经填满，填满的话则要为玩家加分，并且消去该行
		for (var i = 0; i < tar.length; i++) {
			result = true;
			for (var j = 0; j < 10; j++) {
				index = (13 - tar[i]) * 10 + j;
				if (index < 0 || index > 130)
					continue;
				if (self.bricks[index].show === false) {
					result = false;
					break;
				}
			}
			if (result) {
				self.addScore();
				temp.push(tar[i]);
			}
		}
		//消去填满的行
		for (var i = 0; i < temp.length; i++) {
			for (var j = 0; j < 10; j++) {
				index = (13 - temp[i]) * 10 + j;
				if (index < 0 || index > 130)
					continue;
				self.bricks[index].show = false;
				self.bricks[index].item["style"]["display"] = "none";
			}
		}
		temp.sort(function (a, b) {
			if (a < b)
				return -1;
			if (a > b)
				return 1;
			return 0
		});
		//消去之后将上面的砖块下移
		for (var i = 0; i < temp.length; i++) {
			if (temp[i + 1]) { //如果有多行被消去，且这些行不是连续的，那么他们下移的步数不一样
				for (var j = temp[i] + 1; j < temp[i + 1]; j++) {
					for (var k = 0; k < 10; k++) {
						index = (13 - j) * 10 + k;
						if (index < 0 || index > 130)
							continue;
						if (self.bricks[index].show) {
							self.bricks[index].show = false;
							self.bricks[index].item["style"]["display"] = "none";
							index = (14 - j + i) * 10 + k;
							if (self.bricks[index].show === false) {
								self.bricks[index].show = true;
								self.bricks[index].item["style"]["display"] = "block";
							}
						}
					}
				}
			} else {
				for (var j = temp[i] + 1; j < self.MaxH + 1; j++) {
					for (var k = 0; k < 10; k++) {
						index = (13 - j) * 10 + k;
						if (index < 0 || index > 130)
							continue;
						if (self.bricks[index].show) {
							self.bricks[index].show = false;
							self.bricks[index].item["style"]["display"] = "none";
							index = (14 - j + i) * 10 + k;
							if (self.bricks[index].show === false) {
								self.bricks[index].show = true;
								self.bricks[index].item["style"]["display"] = "block";
							}
						}
					}
				}
			}
		}
		self.MaxH -= temp.length;
	},
	checkClash : function () { //检测碰撞
		var self = this;
		var clash = false;
		var index;
		//消除该砖块原来所在位置的影响
		for (var i = 0; i < self.currentBrick.old.length; i++) {
			index = self.currentBrick.old[i].x - 1 + (13 - self.currentBrick.old[i].y) * 10;
			if (index < 0 || index > 140)
				continue;
			self.bricks[index].show = false;
		}
		//看看该砖块现在所占据的位置是否已经被占据
		for (var i = 0; i < 4; i++) {
			index = self.currentBrick.subBricks[i].x - 1 + (13 - self.currentBrick.subBricks[i].y) * 10;
			if (index < 0 || index > 140)
				continue;
			if (self.bricks[index].show === true) {
				clash = true;
				break;
			}
		}
		//如果被占据则本次操作失败，恢复之前的状态
		if (clash) {
			for (var i = 0; i < self.currentBrick.old.length; i++) {
				index = self.currentBrick.old[i].x - 1 + (13 - self.currentBrick.old[i].y) * 10;
				if (index < 0 || index > 140)
					continue;
				self.bricks[index].show = true;
			}
			self.currentBrick.subBricks = self.currentBrick.old;
		}
		return clash;
	},
	start : function () { //开始一个新的游戏,由newGame调用
		var self = this;
		//初始化一个砖块
		self.newBrick();
		self.newBrick();
		//设置定时器
		self.timer = setInterval(function () {
				if (self.isMoving) {}
				else {
					self.isDown = true;
					self.moveDown();
					self.isDown = false;
				}
			}, self.speed);
	},
	stop : function () { //暂停游戏
		var self = this;
		if (self.timer) {
			clearInterval(self.timer);
		}
		self.timer = 0;
	},
	restart : function () { //从暂停重新开始
		var self = this;
		if (!self.timer) {
			self.timer = setInterval(function () {
					if (self.isMoving) {}
					else {
						self.isDown = true;
						self.moveDown();
						self.isDown = false;
					}
				}, self.speed);
		}
	},
	newGame : function () { //开始新游戏
		var self = this;
		self.cleanScreen();
		self.currentBrick = "";
		self.nextBrick = "";
		self.step = 1;
		self.score = 0;
		self.brickCount = 0;
		self.speed = 1200;
		self.isDown = true;
		self.isMoving = false;
		self.MaxH = 1;
		get("gameover")["style"]["display"] = "none";
		get("score").innerHTML = 0;
		if (self.timer) {
			clearInterval(self.timer);
		}
		self.start();
	},
	setSpeed : function () { //设置新的速度
		var self = this;
		self.speed = 1200 - (self.step - 1) * 100;
	},
	levelUp : function () { //升级
		var self = this;
		self.step++;
		self.setSpeed();
		var levelup = get("levelup");
		levelup["style"]["display"] = "block";
		setTimeout(function () {
			levelup["style"]["display"] = "none";
		}, 1000)
	},
	addScore : function () { //加分
		//加分
		var self = this;
		self.score += self.step * 10;
		get("score").innerHTML = self.score;
	},
	gameOver : function () { //游戏结束
		var self = this;
		console.log("gameOver");
		clearInterval(self.timer);
		get("gameover")["style"]["display"] = "block";
	},
	cleanScreen : function () { //清理屏幕
		var self = this;
		for (var i = 0; i < 130; i++) {
			if (self.bricks[i].show === true) {
				self.bricks[i].item["style"]["display"] = "none";
				self.bricks[i].show = false;
			}
		}
	},
	newBrick : function () { //随机生成下一个砖块
		var self = this;
		self.currentBrick = self.nextBrick;
		var seed = Math.ceil(Math.random() * 100) % 7;
		switch (seed) {
		case 0:
			self.nextBrick = new TianBrick();
			break;
		case 1:
			self.nextBrick = new LLBrick();
			break;
		case 2:
			self.nextBrick = new LRBrick();
			break;
		case 3:
			self.nextBrick = new KBrick();
			break;
		case 4:
			self.nextBrick = new LZBrick();
			break;
		case 5:
			self.nextBrick = new RZBrick();
			break;
		case 6:
			self.nextBrick = new IBrick();
			break;
		default:
			self.nextBrick = new IBrick();
			break;
		}
		self.nextBrick.init();
		if ((typeof self.currentBrick).toLowerCase() == "object") //如果当前砖块存在那么提示 下一个砖块
		{
			self.showNext();
			self.brickCount++;
			if (self.brickCount > 20) //检查是否升级
			{
				self.stop(); //停止当前运动
				self.levelUp(); //升级
				self.restart(); //重新setInterval
				self.brickCount = 0;
			}
		}
	}
};
