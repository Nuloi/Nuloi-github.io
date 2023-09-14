let canvas = document.getElementById('flowchartCanvas');
let ctx = canvas.getContext('2d');
let nodes = [];
let connections = [];
let lastClickedNode = null;

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let connection of connections) {
        ctx.beginPath();
        ctx.moveTo(connection.start.x, connection.start.y);
        ctx.lineTo(connection.end.x, connection.end.y);
        ctx.stroke();
    }

    for (let node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.text, node.x, node.y);
    }
}

canvas.addEventListener('mousedown', (event) => {
    for (let node of nodes) {
        if (Math.sqrt((event.clientX - node.x) ** 2 + (event.clientY - node.y) ** 2) <= node.radius) {
            lastClickedNode = node;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (lastClickedNode) {
        lastClickedNode.x = event.clientX;
        lastClickedNode.y = event.clientY;
        redraw();
    }
});

canvas.addEventListener('mouseup', (event) => {
    lastClickedNode = null;
});

function addNode() {
    let colorInput = document.getElementById('nodeColor').value;
    let textInput = document.getElementById('nodeText').value;

    let newNode = {
        x: 100,
        y: 100,
        radius: 20,
        color: colorInput,
        text: textInput
    };
    nodes.push(newNode);
    redraw();
}

function addConnection() {
    if (nodes.length < 2) return;
    let connection = {
        start: nodes[nodes.length - 2],
        end: nodes[nodes.length - 1]
    };
    connections.push(connection);
    redraw();
}

function generateURL() {
    let data = {
        nodes: nodes,
        connections: connections.map(conn => ({
            start: nodes.indexOf(conn.start),
            end: nodes.indexOf(conn.end)
        }))
    };
    let encodedData = btoa(JSON.stringify(data));
    let url = window.location.href.split('?')[0] + '?data=' + encodedData;
    document.getElementById('generatedURL').innerText = url;
}


let urlParams = new URLSearchParams(window.location.search);
let encodedData = urlParams.get('data');
if (encodedData) {
    let data = JSON.parse(atob(encodedData));
    nodes = data.nodes;
    connections = data.connections.map(conn => ({
        start: nodes[conn.start],
        end: nodes[conn.end]
    }));
    redraw();
}