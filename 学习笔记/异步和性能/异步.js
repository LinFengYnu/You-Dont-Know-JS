const arr = 'abcdefg'.split('');
const it = arr[Symbol.iterator]();
setTimeout(function loop(){
	let i = it.next();
	if(i.done) return;
	console.log(i.value);
	setTimeout(loop,1000);
},1000);

const arr = 'abcdefg'.split('');
function sleep(time){
	return new Promise(resolve=>{
		setTimeout(resolve,time);
	})
}

async function main (arr){
	for(let i of arr){
		await sleep(1000);
		console.log(i);
	}
}
main(arr)

