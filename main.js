const sha256=require('crypto-js/sha256')
const fs=require('fs')
flag=['utf-8', '0666', 'rs']
class Block{
    constructor(data,previousHash) {
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.computeHash();
    }
    computeHash()
    {
    return sha256(this.data+this.previousHash).toString()
    }
}
class Chain{
    constructor() {
        this.chain=[this.bigBang()]
    }
    bigBang(){
        const firstBlock=new Block("print('Begin')")
        return firstBlock
    }
    getLatestBlock()
    {
        return this.chain[this.chain.length-1]
    }
    addBlockToChain(newBlock){
        newBlock.previousHash=this.getLatestBlock().hash
        newBlock.hash=newBlock.computeHash()
        this.chain.push(newBlock)
    }
    testChain(){
        if (this.chain.length === 1) {
            if (this.chain[0].hash !== this.chain[0].computeHash()) {
                return false
            }
            return true
        }
        for(let i=1;i<=this.chain.length-1;i++)
        {
            const blockTo=this.chain[i]
            if(blockTo.hash!==blockTo.computeHash())
            {
                console.log("数据被篡改")
                return false
            }
            const previousBlock=this.chain[i-1]
            if(blockTo.previousHash!==previousBlock.hash){
                console.log("区块链断裂")
                return false
            }
        }
        return true
    }
}
const chain=new Chain()
const block1 =new Block("a=15","")
chain.addBlockToChain(block1)
const block2 =new Block("print('a通过rsa加密后得到的明文')","")
chain.addBlockToChain(block2)
const block3 =new Block("print(jiami(a))","")
chain.addBlockToChain(block3)
const block4 =new Block("print('用明文解密后得到的值')","")
chain.addBlockToChain(block4)
const block5 =new Block("print(jiemi(jiami(a)))","")
chain.addBlockToChain(block5)
console.log("准备写入文件");
for(let i=0;i<chain.chain.length;i++){
fs.appendFile('input.txt',chain.chain[i].data+'\t'+chain.chain[i].previousHash+'\t'+chain.chain[i].hash+'\n',flag,function(err) {
    if (err) {
        return console.error(err);
    }
});}