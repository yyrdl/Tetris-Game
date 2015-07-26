/*
由郑杰创建于2015年7月19日
该文件主要负责UI控制

 */
var en;

function ssss()
{
	var str="";
	var index;
	for(var i=0;i<14;i++)
	{
		for(var j=0;j<10;j++)
		{
			index=i*10+j;
			if(en.bricks[index].show)
			{
				str+=":#:";
			}else
			{
				str+=":@:";
			}
		}
		if(i<9)
		{
			console.log("0"+(i+1)+str);
		}
		else
		{
			console.log((i+1)+str);
		}
		str="";
	}
}
function fitWindow() {}

(function () {

	//fitWindow();

	//window.onresize=fitWindow;
	setTimeout(function () {
		en = new GameEngine();
		en.init();
		get("newGame").onclick = function (e) {
			en.newGame();
		};
		get("gameStop").onclick = function (e) {
			en.stop();
		};
		get("gameStart").onclick = function (e) {
			en.restart();
		};
	}, 100);

})();
