/*
Created By Jason Zheng at 12/7/2015

Description: Define Brick Object

  定义各种砖块，即相应的变形动作

 */

/*************************************************************************************/
//砖块的基类，提供基本的共有操作，比如左移右移下移
function Brick() {
	this.maxX = 10;
	this.maxY = 13;
	this.old=[];
};
Brick.prototype = {
	moveDown : function () {
		var self = this;
		self.old=[];
		self.subBricks.forEach(function (item, index, arr) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			self.old.push(obj);
			arr[index].y--;
		});
		return false;
	},
	moveLeft : function () {
		var self = this;
		self.old=[];
		self.subBricks.forEach(function (a, index, arr) {
			var obj = {};
			obj.x = a.x;
			obj.y = a.y;
			self.old.push(obj);
			arr[index].x--;
		});
		self.fit();
	},
	moveRight : function () {
		var self = this;
		self.old=[];
		self.subBricks.forEach(function (item, index, arr) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			self.old.push(obj);
			arr[index].x++;
		});
		self.fit();
	},
	init : function () {
		this.subBricks.sort(compareX);
		var self = this;
		var len = self.subBricks.length;
		var step = Math.ceil(Math.random()) * 100 % (self.maxX - self.subBricks[len - 1].x);//生成一个随机的位置
		self.subBricks.forEach(function (item, index, arr) {
			arr[index].x += step;
		});
		self.old=self.subBricks;
	},
	fit : function () {//确保砖块的位置不会超出左右边界
		var self = this;
		self.subBricks.sort(compareX);
		if (self.subBricks[3].x > 10) {
			var step = 10 - self.subBricks[3].x;
			self.subBricks.forEach(function (item, index, arr) {
				arr[index].x += step;
			});
		}
		if(self.subBricks[0].x<1)
		{
			var step=1-self.subBricks[0].x;
			self.subBricks.forEach(function(item,index,arr){
				arr[index].x+=step;
			});
		}
	},
	getLD : function () {//得到最左下的小砖块，以此为基准生成新的位置(供变形的时候用)
		var self = this;
		self.subBricks.sort(compareXThenY);
		var obj = {
			"x" : self.subBricks[0].x,
			"y" : self.subBricks[0].y
		};
		return obj;
	} 
};
//下面分别定义各个砖块的变形法则，同一对外提供change方法
/*************************************************************************************/
//像田字一样的砖块
function TianBrick() {
	this.subBricks = [{
			"x" : 1,
			"y" : 14
		}, {
			"x" : 1,
			"y" : 13
		}, {
			"x" : 2,
			"y" : 14
		}, {
			"x" : 2,
			"y" : 13
		}
	];
	this.change = function () {
		var self=this;
		self.old=self.subBricks;
	}; //该类型的砖块没有任何变化
};

TianBrick.prototype = new Brick();

/*************************************************************************************/
//成L型的砖块
function LLBrick() {
	this.subBricks = [{
			"x" : 1,
			"y" : 13
		}, {
			"x" : 2,
			"y" : 13
		}, {
			"x" : 2,
			"y" : 14
		}, {
			"x" : 2,
			"y" : 15
		}
	];
	this.current = 1;
	var self = this;
	this.change1 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 2,
				"y" : LD.y
			}
		];
		self.fit();
		self.current = 2;
		self.old=old;

	};
	this.change2 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x,
				"y" : LD.y + 2
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 2
			}
		];
		self.fit();
		self.current = 3;
		self.old=old;
	};
	this.change3 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 2,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 2,
				"y" : LD.y
			}
		];
		self.fit();
		self.current = 4;
		self.old=old;
	};
	this.change4 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}
		];
		self.fit();
		self.current = 1;
		self.old=old;
	};
	this.change = function () {
		switch (self.current) {
		case 1:
			self.change1();
			break;
		case 2:
			self.change2();
			break;
		case 3:
			self.change3();
			break;
		case 4:
			self.change4();
			break;
		default:
			console.log("Unknown error!");
			break;
		}
	}
}
LLBrick.prototype = new Brick();

/*************************************************************************************/
//LRBrick Beginning
function LRBrick() {
	this.subBricks = [{
			"x" : 1,
			"y" : 13
		}, {
			"x" : 1,
			"y" : 14
		}, {
			"x" : 1,
			"y" : 15
		}, {
			"x" : 2,
			"y" : 13
		}
	];
	this.current = 1;
	var self = this;
	this.change1 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 2,
				"y" : LD.y + 1
			}
		];
		self.fit();
		self.current = 2;
	    self.old=old;
	};
	this.change2 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 2
			}, {
				"x" : LD.x,
				"y" : LD.y + 2
			}
		];
		self.fit();
		self.current = 3;
		self.old=old;
	};
	this.change3 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y - 2
			}, {
				"x" : LD.x + 1,
				"y" : LD.y - 2
			}, {
				"x" : LD.x + 2,
				"y" : LD.y - 2
			}, {
				"x" : LD.x + 2,
				"y" : LD.y - 1
			}
		];
		self.fit();
		self.current = 4;
		self.old=old;
	};
	this.change4 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x,
				"y" : LD.y + 2
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}
		];
		self.fit();
		self.current = 1;
	    self.old=old;
	};
	this.change = function () {
		switch (self.current) {
		case 1:
			self.change1();
			break;
		case 2:
			self.change2();
			break;
		case 3:
			self.change3();
			break;
		case 4:
			self.change4();
			break;
		default:
			console.log("Unknown error!");
			break;
		}
	};
}
LRBrick.prototype = new Brick();
//LRBrick end
/*************************************************************************************/
function KBrick() {
	this.subBricks = [{
			"x" : 1,
			"y" : 13
		}, {
			"x" : 1,
			"y" : 14
		}, {
			"x" : 1,
			"y" : 15
		}, {
			"x" : 2,
			"y" : 14
		}
	];
	var self = this;
	this.current = 1;
	this.change1 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 2,
				"y" : LD.y + 1
			}
		];
		self.fit();
		self.current = 2;
		self.old=old;
	};

	this.change2 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}
		];
		self.fit();
		self.current = 3;
		self.old=old;
	};
	this.change3 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 2,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}
		];
		self.fit();
		self.current = 4;
		self.old=old;
	};
	this.change4 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}, {
				"x" : LD.x,
				"y" : LD.y + 2
			}
		];
		self.fit();
		self.current = 1;
		self.old=old;
	};
	this.change = function () {
		switch (self.current) {
		case 1:
			self.change1();
			break;
		case 2:
			self.change2();
			break;
		case 3:
			self.change3();
			break;
		case 4:
			self.change4();
			break;
		default:
			console.log("Unknown error!");
			break;
		}
	}
};
KBrick.prototype = new Brick();
/*************************************************************************************/
function LZBrick() {
	this.subBricks = [{
			"x" : 1,
			"y" : 13
		}, {
			"x" : 1,
			"y" : 14
		}, {
			"x" : 2,
			"y" : 14
		}, {
			"x" : 2,
			"y" : 15
		}
	];
	var self = this;
	self.current = 1;
	this.change1 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 2,
				"y" : LD.y
			}
		];
		self.fit();
		self.current = 2;
		self.old=old;
	};
	this.change2 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y - 1
			}, {
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}
		];
		self.fit();
		self.current = 1;
		self.old=old;
	};
	this.change = function () {
		switch (self.current) {
		case 1:
			self.change1();
			break;
		case 2:
			self.change2();
			break;
		default:
			console.log("Unknown error!");
			break;
		}
	};
}
LZBrick.prototype = new Brick();
/*************************************************************************************/
function RZBrick() {
	this.subBricks = [{
			"x" : 2,
			"y" : 13
		}, {
			"x" : 2,
			"y" : 14
		}, {
			"x" : 1,
			"y" : 14
		}, {
			"x" : 1,
			"y" : 15
		}
	];
	this.current = 1;
	var self = this;
	this.change1 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y - 1
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 2,
				"y" : LD.y
			}
		];
		self.fit();
		self.current = 2;
		self.old=old;
	};
	this.change2 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x,
				"y" : LD.y + 2
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y + 1
			}
		];
		self.fit();
		self.current = 1;
		self.old=old;
	};
	this.change = function () {
		switch (self.current) {
		case 1:
			self.change1();
			break;
		case 2:
			self.change2();
			break;
		default:
			console.log("Unknown error!");
			break;
		}
	};
}
RZBrick.prototype = new Brick();
/*************************************************************************************/
function IBrick() {
	this.subBricks = [{
			"x" : 1,
			"y" : 13
		}, {
			"x" : 1,
			"y" : 14
		}, {
			"x" : 1,
			"y" : 15
		}, {
			"x" : 1,
			"y" : 16
		}
	];
	this.current = 1;
	var self = this;
	this.change1 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x + 1,
				"y" : LD.y
			}, {
				"x" : LD.x + 2,
				"y" : LD.y
			}, {
				"x" : LD.x + 3,
				"y" : LD.y
			}
		];
		self.fit();
		self.current = 2;
		self.old=old;
	};
	this.change2 = function () {
		var old = [];
		self.subBricks.forEach(function (item) {
			var obj = {};
			obj.x = item.x;
			obj.y = item.y;
			old.push(obj);
		});
		var LD = self.getLD();
		self.subBricks = [{
				"x" : LD.x,
				"y" : LD.y
			}, {
				"x" : LD.x,
				"y" : LD.y + 1
			}, {
				"x" : LD.x,
				"y" : LD.y + 2
			}, {
				"x" : LD.x,
				"y" : LD.y + 3
			}
		];
		self.fit();
		self.current = 1;
		self.old=old;
	};
	this.change = function () {
		switch (self.current) {
		case 1:
			self.change1();
			break;
		case 2:
			self.change2();
			break;
		default:
			console.log("Unknown error!");
			break;
		}
	};
}
IBrick.prototype = new Brick();
/*************************************************************************************/
