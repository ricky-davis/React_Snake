import React from 'react';
import ReactDOM from 'react-dom';

let app = document.createElement("div");
app.id="app";
document.body.appendChild(app);

function isArrayInArray(arr, item){
    let item_as_string = JSON.stringify(item);

    let contains = arr.some(function(ele){
        return JSON.stringify(ele) === item_as_string;
    });
    return contains;
}
function shiftBlocks(arr,move){
    return arr.map(block=>{
        block[0]+=move[0];
        block[1]+=move[1];
        return block;
    })
}

class Square extends React.Component {
    constructor(props) {
        super(props);
    }

    getClass(){
        let classBuffer="square ";
        let highlight = this.props.highlight;
        if(highlight){
            classBuffer+=highlight+" ";
        }
        return classBuffer;
    }


    render() {
        const divStyle = {
            position:"absolute",
            top:(this.props.i*10)+this.props.ptop,
            left:(this.props.j*10)+this.props.pleft,
            height:this.props.size,
            width:this.props.size,
        };

        return(
            <span style={divStyle}
                className={this.getClass()}
            >
            </span>
        );
    };
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.arLength=40;
        this.snakeLength=10;
        this.snakeSize=10;
        this.snakeDir="d";
        this.gameSpeed=100;
        this.state = {
            gameSpeed:this.gameSpeed,
            gameState:1,
            arLength:this.arLength,
            foodSpot:Array(2),
            squares: Array(this.arLength).fill(Array(this.arLength).fill("none")),
            snakeDir:this.snakeDir,
            tempDir:this.snakeDir,
            snake: Array(this.snakeLength).fill(Array(2).fill(null)),
        };
        this.initializeSnake();
        this.gameLogic = this.gameLogic.bind(this);
        this.timer = setTimeout(this.gameLogic, this.state.gameSpeed);
        console.log(this.state);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.generateRandomFood = this.generateRandomFood.bind(this);
    }
    initializeSnake(){
        let snake = this.state.snake;
        for(let i=0;i<snake.length;i++) {
            let sliced = snake[i].slice();
            sliced[0] = this.state.arLength / 2;
            sliced[1] = (this.state.arLength / 2)+i;
            snake[i] = sliced;
        }
        this.state.snake = snake;
        this.generateRandomFood();
    }
    generateRandomFood(){
        let randX;
        let randY;
        do {
            randX = Math.floor(Math.random() * this.state.arLength);
            randY = Math.floor(Math.random() * this.state.arLength);
        }while(isArrayInArray(this.state.snake, [randX, randY]));
        this.state.foodSpot = [randX, randY];
    }
    loseEvent(){
        this.state.gameState=2;
        clearTimeout(this.timer);
        clearInterval(this.timer);
        console.log("YOU LOSE");
        let YOU=[[0,0],[1,0],[2,1],[3,2],[2,3],[1,4],[0,4],
            [4,2],[5,2],[6,2],

            [0,7],[0,8],[0,9],
            [1,6],[2,6],[3,6],[4,6],[5,6],
            [1,10],[2,10],[3,10],[4,10],[5,10],
            [6,7],[6,8],[6,9],


            [0,12],[1,12],[2,12],[3,12],[4,12],[5,12],
            [0,16],[1,16],[2,16],[3,16],[4,16],[5,16],
            [6,13],[6,14],[6,15],
        ];
        let LOSE=[
            [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
            [6,1],[6,2],[6,3],[6,4],

            [0,7],[0,8],[0,9],
            [1,6],[2,6],[3,6],[4,6],[5,6],
            [1,10],[2,10],[3,10],[4,10],[5,10],
            [6,7],[6,8],[6,9],

            [0,13],[0,14],[0,15],[0,16],
            [1,12],[2,12],
            [3,13],[3,14],[3,15],
            [4,16],[5,16],
            [6,12],[6,13],[6,14],[6,15],

            [0,18],[0,19],[0,20],[0,21],[0,22],
            [1,18],
            [2,18],
            [3,18],[3,19],[3,20],[3,21],
            [4,18],
            [5,18],
            [6,18],[6,19],[6,20],[6,21],[6,22],

        ];
        let xOffset=(this.state.arLength/2)-12;
        let yOffset=(this.state.arLength/2)-8;
        YOU = shiftBlocks(YOU,[yOffset+0,xOffset+3]);
        LOSE = shiftBlocks(LOSE,[yOffset+8,xOffset+0]);
        let snake=[];
        snake = snake.concat(YOU);
        snake = snake.concat(LOSE);
        snake.push([-1,-1]);
        this.setState({snake:snake});
        this.setState({foodSpot:[-1,-1]})
    }
    gameLogic(){
        if(this.state.gameState===1) {
            this.setState({snakeDir: this.state.tempDir});
            let snake = this.state.snake.slice();

            let newPos = snake[snake.length - 1].slice();
            switch (this.state.snakeDir) {
                case "w":
                    newPos[0] -= 1;
                    break;
                case "s":
                    newPos[0] += 1;
                    break;
                case "a":
                    newPos[1] -= 1;
                    break;
                case "d":
                    newPos[1] += 1;
                    break;
            }
            if (newPos[0] > this.state.arLength - 1) newPos[0] = 0;
            if (newPos[0] < 0) newPos[0] = this.state.arLength - 1;
            if (newPos[1] > this.state.arLength - 1) newPos[1] = 0;
            if (newPos[1] < 0) newPos[1] = this.state.arLength - 1;
            let removed = snake.shift();
            snake.push(newPos);

            let bodyArray = snake.slice();
            bodyArray.pop();
            //console.log(snake[snake.length-1]);
            if (isArrayInArray(bodyArray, snake[snake.length - 1])) {
                this.loseEvent();
                return;
            }

            if (JSON.stringify(this.state.snake[this.state.snake.length - 1]) === JSON.stringify(this.state.foodSpot)) {
                snake.unshift(removed);
                this.generateRandomFood();
            }
            this.setState({snake: snake});

            this.setState({gameSpeed: this.gameSpeed-(snake.length)});
            console.log(this.state.gameSpeed);
            this.timer = setTimeout(this.gameLogic, this.state.gameSpeed);
        }
    }
    renderSquare(i,j) {
        let highlight;
        if(this.state.gameState===1) {
            if (isArrayInArray(this.state.snake, [i, j])) {
                highlight = "highlightBody";
            }
            if (JSON.stringify(this.state.snake[this.state.snake.length - 1]) === JSON.stringify([i, j])) {
                highlight = "highlightHead";
            }
            if (JSON.stringify(this.state.foodSpot) === JSON.stringify([i, j])) {
                highlight = "highlightFood";
            }
        }else if(this.state.gameState===2){
            if (isArrayInArray(this.state.snake, [i, j])) {
                highlight = "LostGameBody";
            }
        }
        if(highlight) {
            return (
                <Square key={i + "," + j}
                        highlight={highlight}
                        i={i}
                        j={j}
                        pleft={this.state.left}
                        ptop={this.state.top}
                        size={this.snakeSize}
                />
            );
        }
    }

    createTable() {
        let table = [];
        // Outer loop to create parent
        for (let i = 0; i < this.state.squares.length; i++) {
            let children = [];
            //Inner loop to create children
            for (let j = 0; j < this.state.squares[i].length; j++) {
                table.push(this.renderSquare(i,j));
            }
        }
        return table
    }

    getSize(bounds){
        this.setState({left: bounds.left});
        this.setState({top: bounds.top});
    }

    refCallback = element => {
        if (element) {
            this.setState({elementObj:element});
            this.getSize(element.getBoundingClientRect());
        }
    };
    onKeyPressed(e) {
        // console.log(e.key);
        // console.log(this.state.snakeDir);
        let k=e.key;
        let nextDir = this.state.snakeDir;
        if(k==="w" && this.state.snakeDir !=="s"){
            nextDir="w";
        }else if(k==="s" && this.state.snakeDir !=="w"){
            nextDir="s";
        }else if(k==="a" && this.state.snakeDir !=="d"){
            nextDir="a";
        }else if(k==="d" && this.state.snakeDir !=="a"){
            nextDir="d";
        }
        this.setState({tempDir:nextDir});
    }

    render() {
        document.addEventListener("keydown", this.onKeyPressed, false);
        const divStyle = {
            width:this.state.arLength*this.snakeSize+"px",
            height:this.state.arLength*this.snakeSize+"px",
        }
        return (
            <div key={"gameBoardHolder"} ref={this.refCallback} style={divStyle} className="GameHolder"
            >
                {this.createTable()}
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('app')
);
