

function compareY(a,b)
{
	if(a.y<b.y)
		return -1;
	if(a.y>b.y)
		return 1;
	return 0;
}

function compareX(a,b)
{
	if(a.x<b.x)
		return -1;
	if(a.x>b.x)
		return 1;
	return 0;
}
function compareXThenY(a,b)
{
	 if(a.x!==b.x)
	 {
		 return compareX(a,b);
	 }else
	 {
		 return compareY(a,b);
	 }
}

 function get(id)
{
	return document.getElementById(id);
}

