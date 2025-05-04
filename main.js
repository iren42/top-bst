import { Tree } from "./Tree.js";

const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const arr1 = [1, 2, 3, 4, 6, 8, 9];
const arr2 = [1, 2];
const test = new Tree(arr);
const test1 = new Tree(arr1);
const test2 = new Tree(arr2);

test1.prettyPrint();
test1.insert(5);
test1.prettyPrint();
test1.insert(7);
test1.prettyPrint();

// console.log(test1.deleteItem(6));
// console.log(test1.deleteItem(1));
// console.log(test1.deleteItem(2));
// console.log(test1.deleteItem(3));
test1.prettyPrint();
// console.log(test1.deleteItem(5));
test1.prettyPrint();
// console.log(test1.deleteItem(8));
test1.prettyPrint();

// console.log(test1.find(5));
// console.log(test1.find(4));
// console.log(test1.find(7));

function double(element) {
	return (element.data *= 2);
}

function log(element) {
	console.log(element.data);
}

test1.prettyPrint();
test1.levelOrder(double);
test1.prettyPrint();

// test1.preOrder(log);
// test1.inOrder(log);

console.log(test1.height(12));
console.log(test1.height(10));
console.log(test1.height(16));
console.log(test1.height(8));
console.log(test1.depth(8));
console.log(test1.depth(4));
console.log(test1.depth(6));
console.log(test1.depth(10));
console.log(test1.depth(12));
console.log(test1.depth(42));

test2.insert(3);
test2.prettyPrint();
console.log(test2.isBalanced());

test.prettyPrint();
console.log(test.isBalanced());

test1.deleteItem(2);
test1.deleteItem(6);
test1.prettyPrint();
console.log(test1.isBalanced());

test1.rebalance();

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function createRandomArray(n) {
	const arr = []
	for (let i = 0; i < n; i++) {
		arr.push(getRandomInt(1000));
	}
	return (arr);
}

const a1 = createRandomArray(100);
console.log(a1);

const t1 = new Tree(a1);
console.log(t1.isBalanced());
t1.preOrder(log);
t1.inOrder(log);
t1.postOrder(log);

function unbalanceTree(tree, n) {
	for (let i = 0; i < n; i++) {
		tree.insert(getRandomInt(1000));
	}
}

unbalanceTree(t1, 100);
console.log(t1.isBalanced());
console.log("before rebalance");
t1.prettyPrint();
t1.rebalance();
console.log("after rebalance");
t1.prettyPrint();

console.log(t1.isBalanced());
