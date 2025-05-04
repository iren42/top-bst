const ERR_INVALID_INPUT = "Invalid input";
const ERR_CB = "No callback function provided";

export class Tree {
	constructor(array) {
		this.array = array;
		this.root = buildTree(array);
	}
}

class Node {
	left;
	right;
	constructor(data = 0) {
		this.data = data;
		this.left = null;
		this.right = null;
	}

	set right(node) {
		this.right = node;
	}
	set left(node) {
		this.left = node;
	}
}

function uniq(a) {
	return (Array.from(new Set(a)));
}

function hasOnlyNumbers(array) {
	return (array.some(element => typeof element === "number"));
}

function isValid(array) {
	if (!hasOnlyNumbers(array))
		return (false);
	return (true);
}

function buildTree(array) {
	if (!isValid(array))
		throw new Error(ERR_INVALID_INPUT);

	array.sort((a, b) => a - b);
	array = uniq(array);
	const root = createBST(array, 0, array.length - 1);
	return (root);
}

function createBST(array, start, end) {
	if (start > end)
		return (null);
	const mid = Math.floor((end + start) / 2);
	const root = new Node(array[mid]);
	root.left = createBST(array, start, mid - 1);
	root.right = createBST(array, mid + 1, end);
	return (root);
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
	if (node === null) {
		return;
	}
	if (node.right !== null) {
		prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
	}
	console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
	if (node.left !== null) {
		prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
	}
};

Tree.prototype.prettyPrint = function() {
	prettyPrint(this.root);
}

Tree.prototype.insert = function(value) {
	if (!value)
		throw new Error(ERR_INVALID_INPUT, value);
	const node = new Node(value);
	const nodes = { prev: null };
	findNode(value, this.root, nodes);
	const leaf = nodes.prev;
	if (!leaf)
		return (false);
	if (leaf.data === value)
		return (false);
	if (value < leaf.data)
		leaf.left = node;
	else
		leaf.right = node;
	return (true);
}

function findNode(value, root, nodes = null) {
	let current = root;
	while (current !== null && current.data !== value) {
		if (nodes)
			nodes.prev = current;
		if (value < current.data) {
			current = current.left;
		} else {
			current = current.right;
		}
	}
	return (current);
}

function findInorderSucc(toDelete, nodes = null) {
	let inorderSucc = toDelete.right;

	while (inorderSucc.left) {
		if (nodes)
			nodes.prev = inorderSucc;
		inorderSucc = inorderSucc.left;
	}
	return (inorderSucc);
}

function hasTwoChildren(node) {
	return (node.left && node.right);
}

function isNodeToDeleteRoot(nodes) {
	return (nodes.prev === null);
}

Tree.prototype.deleteItem = function(value) {
	if (!this.root)
		return (false);
	const nodes = { prev: null };
	const toDelete = findNode(value, this.root, nodes);
	let replacement;

	// case 1: node not found
	if (!toDelete)
		return (false);

	// case 2: node has two children
	if (hasTwoChildren(toDelete)) {
		nodes.prev = null;
		replacement = findInorderSucc(toDelete, nodes);

		if (nodes.prev)
			nodes.prev.left = replacement.right;
		else
			toDelete.right = replacement.right;
		toDelete.data = replacement.data;
		return (true);
	}

	// case 3: node has one child or none
	replacement = (toDelete.left === null) ? toDelete.right : toDelete.left;

	if (isNodeToDeleteRoot(nodes)) {
		this.root = replacement;
		return (true);
	}
	if (toDelete === nodes.prev.left)
		nodes.prev.left = replacement;
	else
		nodes.prev.right = replacement;
	return (true);
}

Tree.prototype.find = function(value) {
	const current = findNode(value, this.root);
	return (current);
}

Tree.prototype.levelOrder = function(cb) {
	if (!cb || typeof cb !== "function")
		throw new Error(ERR_CB);
	const queue = [];
	let ptr = this.root;

	queue.push(this.root.left);
	queue.push(this.root.right);
	while (ptr) {
		cb(ptr);
		if (!queue.length)
			break;
		ptr = queue.shift();
		if (ptr.left)
			queue.push(ptr.left);
		if (ptr.right)
			queue.push(ptr.right);
	}
}

function preOrder(cb, node) {
	if (node === null)
		return;
	cb(node);
	preOrder(cb, node.left);
	preOrder(cb, node.right);
}

Tree.prototype.preOrder = function(cb) {
	if (!cb || typeof cb !== "function")
		throw new Error(ERR_CB);
	preOrder(cb, this.root);
}

function inOrder(cb, node) {
	if (node === null)
		return;
	inOrder(cb, node.left);
	cb(node);
	inOrder(cb, node.right);
}

Tree.prototype.inOrder = function(cb) {
	if (!cb || typeof cb !== "function")
		throw new Error(ERR_CB);
	inOrder(cb, this.root);
}

function postOrder(cb, node) {
	if (node === null)
		return;
	postOrder(cb, node.left);
	postOrder(cb, node.right);
	cb(node);
}

Tree.prototype.postOrder = function(cb) {
	if (!cb || typeof cb !== "function")
		throw new Error(ERR_CB);
	postOrder(cb, this.root);
}

function calcHeight(root) {
	if (!root)
		return (-1);
	const leftHeight = calcHeight(root.left);
	const rightHeight = calcHeight(root.right);
	return (Math.max(leftHeight, rightHeight) + 1);
}

// the number of edges in the longest path from that node to a leaf node.
Tree.prototype.height = function(value) {
	const node = this.find(value);
	if (!node)
		return (null);
	return (calcHeight(node));
}

// the number of edges in the path from that node to the root node.
Tree.prototype.depth = function(value) {
	let ptr = this.root;
	let count = 0;
	while (ptr && ptr.data !== value) {
		count++;
		if (ptr.data > value)
			ptr = ptr.left;
		else
			ptr = ptr.right;
	}
	if (!ptr)
		return (null);
	if (ptr.data !== value)
		return (null);
	return (count);
}

Tree.prototype.isBalanced = function(root = this.root) {
	let leftHeight = -1;
	let rightHeight = -1;
	let diff;

	if (!root)
		return (true);
	if (root.left) {
		leftHeight = this.height(root.left.data);
	}
	if (root.right) {
		rightHeight = this.height(root.right.data);
	}
	diff = leftHeight - rightHeight;
	if (diff >= -1 && diff <= 1)
		return (this.isBalanced(root.left) && this.isBalanced(root.right));
	return (false);
}

function storeInorder(root, nodes) {
	if (root === null)
		return;
	storeInorder(root.left, nodes);
	nodes.push(root.data);
	storeInorder(root.right, nodes);
}

Tree.prototype.rebalance = function() {
	const sorted = [];
	storeInorder(this.root, sorted);
	this.root = buildTree(sorted);
}
